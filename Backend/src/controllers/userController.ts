import { COOKIE_NAME, isProduction, JWT_SECRET } from "../config/constants";
import userDataModel from "../modals/userModal";

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

exports.userRegister = async (req: any, res: any) => {
	const { username, fullName, email, phone, password, ExpoToken } = req.body;

	const checkData = await userDataModel
		.findOne({ $or: [{ username }, { email }] })
		.select("username email");
	if (checkData) return res.status(409).json({ message: "Account already exists", success: false });

	const salt = await bcrypt.genSalt(10);
	const secPass = await bcrypt.hash(password, salt);

	await userDataModel.create({
		username,
		fullName,
		email,
		phone: phone.toString(),
		password: secPass,
		ExpoToken,
		verified: true,
	});

	return res.status(200).json({ message: "Account Created", success: true });
};

exports.allUsers = async (req: any, res: any) => {
	const user = req.user;

	const userData = await userDataModel.findById(user._id);
	if (!userData) return res.status(404).json({ success: false, message: "User not found" });

	if (userData.role !== "admin")
		return res.status(401).json({ success: false, message: "Unauthorised Access" });

	const allUsers = await userDataModel.find().select("-password");
	return res.status(200).json({ message: "Entire User Data", success: true, allUsers });
};

exports.userUpdate = async (req: any, res: any) => {
	const { fullName, email, phone, ExpoToken, vehicle } = req.body;
	const userId = req.user.id;

	const checkData = await userDataModel.findById(userId).select("-password");
	if (!checkData) return res.status(409).json({ message: "Account not found", success: false });
	if (checkData.email === "test@gmail.com") {
		return res.status(409).json({ message: "Test account cannot be updated!", success: false });
	}

	const payload: any = {};

	if (fullName) payload.fullName = fullName;
	if (email) payload.email = email;
	if (phone) payload.phone = phone.toString();
	if (ExpoToken) payload.ExpoToken = ExpoToken;
	if (vehicle) payload.vehicle = vehicle;

	if (email) payload.verified = checkData.email === email ? checkData.verified : false;

	await userDataModel.findByIdAndUpdate(checkData._id, payload, { new: true });

	return res.status(200).json({ message: "Account Updated", success: true });
};

exports.userLogin = async (req: any, res: any, next: any) => {
	const { email, password, rememberMe } = req.body;

	const user = await userDataModel.findOne({ email: email });
	if (!user) return res.json({ message: "Invalid Credentials", success: false });

	const checkPass = await bcrypt.compare(password, user.password);
	if (!checkPass) return res.json({ message: "Invalid Credentials", success: false });
	const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
	if (rememberMe) {
		res.cookie(COOKIE_NAME, token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "None",
			expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), //7days
			// expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24hr
		});
	} else {
		res.cookie(COOKIE_NAME, token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "None",
			expires: new Date(new Date().getTime() + 60 * 60 * 1000), //1hr
		});
	}

	user.password = undefined;
	return res.status(200).json({ message: "Login Success", success: true, user });
};

exports.userLogout = async (req: any, res: any) => {
	res.cookie(COOKIE_NAME, "", {
		expires: new Date(0),
	});
	return res.status(200).send({ message: "Logged out", success: true });
};

exports.userDelete = async (req: any, res: any) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(200).json({
			message: "Unable to verify identity. Please try again or contact support.",
			success: false,
		});

	const user = await userDataModel.findOne({ email: email });
	if (!user) return res.json({ message: "Invalid Credentials", success: false });

	const checkPass = await bcrypt.compare(password, user.password);
	if (!checkPass) return res.json({ message: "Invalid Credentials", success: false });

	await userDataModel.findByIdAndUpdate(user._id, { deleted: true });

	res.cookie(COOKIE_NAME, "", {
		expires: new Date(0),
	});

	return res.status(200).json({ message: "Account has been deleted", success: true });
};

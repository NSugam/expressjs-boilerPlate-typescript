import { COOKIE_NAME, isProduction } from "../config/constants";
import otpDataModel from "../modals/otpModal";
import userDataModel from "../modals/userModal";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../sendMail.js");

const JWT_SECRET = process.env.JWT_SECRET;

exports.sendOTP = async (req: any, res: any) => {
	const { email } = req.body;

	if (!email) return res.status(400).json({ success: false, message: "Email is required" });

	try {
		const user = await userDataModel.findOne({ email });
		if (!user) return res.status(404).json({ success: false, message: "Email not registered." });

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		await otpDataModel.findOneAndUpdate(
			{ userId: user._id },
			{ otpCode: otp, expiresAt },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		const subject = "OTP Verification";
		const htmlBody = `<h2>Your OTP is: ${otp}</h2><p>This OTP will expire in 10 minutes.</p>`;

		await sendMail(email, subject, htmlBody);

		return res.status(200).json({ success: true, message: "OTP sent to email" });
	} catch (err) {
		console.error("Error in /send-otp:", err);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

exports.verifyOTP = async (req: any, res: any) => {
	const { email, otp } = req.body;

	if (!otp) return res.status(400).json({ success: false, message: "OTP is required" });

	try {
		const user = await userDataModel.findOne({ email });
		if (!user) return res.status(404).json({ success: false, message: "User not found" });

		const otpEntry = await otpDataModel.findOne({ userId: user._id, otpCode: otp });

		if (!otpEntry)
			return res
				.status(400)
				.json({ success: false, message: "Invalid OTP. Please request again." });

		if (new Date() > new Date(otpEntry.expiresAt)) {
			await otpDataModel.deleteOne({ userId: user._id });
			return res
				.status(400)
				.json({ success: false, message: "OTP expired. Please request again." });
		}

		const token = jwt.sign({ userId: user._id, otpCode: otp }, JWT_SECRET, { expiresIn: "10m" });

		res.cookie(COOKIE_NAME, token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: "None",
			expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
		});

		user.verified = true;
		await user.save();

		user.password = undefined;
		await otpDataModel.findByIdAndDelete(otpEntry._id);
		return res.status(200).json({ success: true, message: "OTP verified successfully", user });
	} catch (err) {
		console.error("Error in /verify-otp:", err);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

exports.changePassword = async (req: any, res: any) => {
	const { newPassword, confirmPassword } = req.body;
	const user = req.user;

	if (newPassword !== confirmPassword)
		return res.status(401).json({ success: false, message: "Password mismatched!" });

	const token = req.cookies._ap_;
	if (!token) return res.status(401).json({ success: false, message: "Invalid Request" });

	try {
		const decoded: any = jwt.verify(token, JWT_SECRET);
		const otpEntry = await otpDataModel.findOne({
			userId: decoded.userId,
			otpCode: decoded.otpCode,
		});
		if (!otpEntry) return res.status(404).json({ success: false, message: "Invalid Request" });

		const userData = await userDataModel.findById(user._id);
		if (!userData) return res.status(404).json({ success: false, message: "User not found" });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		userData.password = hashedPassword;
		await userData.save();

		await otpDataModel.deleteOne({ userId: user._id });
		res.cookie(COOKIE_NAME, "", {
			expires: new Date(0),
		});
		return res.status(200).json({ success: true, message: "Password changed!" });
	} catch (err) {
		console.error("Error in /change-password:", err);
		return res.status(401).json({ success: false, message: "Invalid or expired request" });
	}
};

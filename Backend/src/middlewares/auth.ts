import { NextFunction, Request, Response } from "express";
import { JWT_SECRET, COOKIE_NAME } from "../config/constants";
import userDataModel from "../modals/userModal";
import jwt from "jsonwebtoken";

// List of routes that do not require authentication
const PUBLIC_ROUTES = [
	"user/register",
	"user/login",
	"user/delete",
	"auth/send-otp",
	"auth/verify-otp",
];

interface JwtPayload {
	userId: string;
	iat?: number;
	exp?: number;
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
	const route = req.originalUrl.replace(/^\/api\//, "").split("?")[0];

	if (PUBLIC_ROUTES.includes(route)) return next();

	try {
		const token = req.cookies?.[COOKIE_NAME];

		if (!token) {
			return res.status(401).json({
				message: "Please Login to Continue",
				success: false,
			});
		}

		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

		const userData = await userDataModel.findOne({ _id: decoded.userId }).select("-password");

		if (!userData) {
			return res.status(401).json({
				message: "Invalid User Credentials",
				success: false,
			});
		}

		// Attach user to request
		(req as any).user = userData;

		next();
	} catch (error: any) {
		return res.status(401).json({
			message: "Unauthorized: " + error.message,
			success: false,
		});
	}
};

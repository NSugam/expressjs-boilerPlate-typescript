// middlewares/multerErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";

export function multerErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	if (err instanceof multer.MulterError) {
		// Multer-specific error
		return res.status(400).json({ success: false, message: err.message });
	} else if (err) {
		// File filter or other custom errors
		console.log(err);
		return res.status(400).json({ success: false, message: err.message });
	}
	next();
}

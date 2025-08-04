import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { RequestwithAuth } from "../config/CustomRequest";

exports.upload = async (req: any, res: any, next: any) => {
	try {
		if (!req.file) {
			const error = new Error("No file uploaded");
			(error as any).status = 400;
			throw error;
		}
		res.json({ success: true, filename: req.file.filename });
	} catch (err) {
		if (err instanceof multer.MulterError) {
			(err as any).status = 400;
		}
		next(err);
	}
};

exports.uploadMultiple = async (req: Request, res: Response) => {
	const files = req.files as { [fieldname: string]: Express.Multer.File[] };

	const allFiles = Object.values(files).flat();

	if (allFiles.length === 0) {
		return res.status(400).json({ success: false, message: "No files uploaded" });
	}

	res.json({
		success: true,
		message: `${allFiles.length} files uploaded successfully`,
		files: allFiles.map(file => ({
			filename: file.filename,
			orginalName: file.originalname,
			mimetype: file.mimetype,
			path: file.path,
			encoding: file.encoding,
		})),
	});
};

export const getFile = (req: RequestwithAuth, res: Response) => {
	const { filename } = req.params;

	// Construct file path: uploads/<username>/<filename>
	const filePath = path.join(__dirname, "..", "uploads", req.user.username, filename);

	// Check if file exists
	if (!fs.existsSync(filePath)) {
		return res.status(404).json({
			success: false,
			message: "File not found",
		});
	}

	// Check ownership by filename prefix
	if (!filename.startsWith(req.user.username)) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized Access",
		});
	}

	// Send the file
	return res.status(200).sendFile(filePath);
};

import crypto from "crypto";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { RequestwithAuth } from "./CustomRequest";
import { allowedMimeTypes } from "./fileTypes";

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter: allow images and PDF only
const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				`Unsupported file type: ${file.mimetype}. Only Image, MP4 video, and MP3 audio files are allowed.`
			)
		);
	}
};

const storage = multer.diskStorage({
	destination: function (req, file: Express.Multer.File, cb) {
		const { username } = (req as RequestwithAuth).user;
		const userFolder = path.join(uploadDir, username);
		fs.mkdirSync(userFolder, { recursive: true });
		cb(null, userFolder);
	},

	filename: function (req: RequestwithAuth, file, cb) {
		const now = new Date();
		const date = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
		const time = now.toTimeString().split(" ")[0].replace(/:/g, ""); // HHMMSS

		const formattedDateandTime = `${date}_${time}`;
		const uniqueId = crypto.randomBytes(3).toString("hex"); // 6-char token
		const extension = path.extname(file.originalname);

		const uniqueFilename = `${req.user.username}-${formattedDateandTime}-${uniqueId}${extension}`;
		cb(null, uniqueFilename);
	},
});

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 50 * 1024 * 1024, // 50 MB limit
	},
});
export default upload;

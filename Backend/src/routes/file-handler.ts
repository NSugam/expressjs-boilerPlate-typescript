import { NextFunction, Request, Response, Router } from "express";
import upload from "../config/multerConfig";
import { multerErrorHandler } from "../middlewares/multerErrorHandler";
import limiter from "../middlewares/rate-limiter";
import { fileUploadSchema, multipleFilesSchema } from "../middlewares/validate";
const fileHandleController = require("../controllers/fileHandleController");
var validator = require("express-joi-validation").createValidator({});
var validate = require("../middlewares/validate");

const router = Router();

router.post(
	"/upload",
	limiter,
	upload.single("uploadedFile"),
	multerErrorHandler,
	(req: Request, res: Response, next: NextFunction) => {
		const { error } = fileUploadSchema.validate({
			uploadedFile: req.file,
		});
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}
		next();
	},
	fileHandleController.upload
);

router.post(
	"/upload-multiple",
	// limiter,
	upload.array("uploadedFiles", 10),
	multerErrorHandler,
	(req: Request, res: Response, next: NextFunction) => {
		const { error } = multipleFilesSchema.validate({
			uploadedFiles: req.files,
		});
		if (error) {
			return res.status(400).json({ success: false, message: error.details[0].message });
		}
		next();
	},
	fileHandleController.uploadMultiple
);

router.get("/:filename", fileHandleController.getFile);

module.exports = router;

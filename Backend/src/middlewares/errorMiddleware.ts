import { Request, Response, NextFunction } from "express";

const generalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error("[Error]", err.stack || err);

	const statusCode = err.status || 500;

	res.status(statusCode).json({
		status: statusCode,
		success: false,
		message: err.message || "Internal Server Error",
		// Optional: send stack only in development
		...(process.env.NODE_ENV !== "production" && {
			stack: err.stack,
		}),
	});
};

export default generalErrorHandler;

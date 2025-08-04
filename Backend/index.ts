import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { connectionString, FRONTEND_URL, NODE_ENV, PORT } from "./src/config/constants";
import { checkAuth } from "./src/middlewares/auth";
import generalErrorHandler from "./src/middlewares/errorMiddleware";
import routes from "./src/routes";

const app = express();

// DB Initialization: Mongodb
mongoose
	.connect(connectionString)
	.then(() => {
		if (connectionString.includes("localhost")) {
			console.log("Connected to MongoDB: Local");
		} else if (connectionString.includes("mongodb+srv://")) {
			console.log("Connected to MongoDB: Atlas");
		} else {
			console.log("Connected to MongoDB (Custom/Unknown)");
		}
	})
	.catch((error: any) => {
		console.error("DB connection error:", error);
	});

// Middlewares
app.use(express.json());

const allowedOrigin = [FRONTEND_URL];

app.use(
	cors({
		credentials: true,
		origin: allowedOrigin,
	})
);

app.use(cookieParser());

app.get("/", (req, res) => {
	res.send(`
    <h1>Welcome to ExpressJS-BoilerPlate</h1>
  `);
});

app.get("/upload", (req, res) => {
	res.send(`
    <h1>File Upload</h1>
    <form action="/api/file/upload-multiple" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFiles" multiple />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Protect all /api routes with checkAuth middleware
app.use("/api", checkAuth, routes);

// Global error handler
app.use(generalErrorHandler);

app.listen(PORT, "0.0.0.0", () => {
	console.log(`\n${NODE_ENV} server running on port: ${PORT}`);
});

export default app;

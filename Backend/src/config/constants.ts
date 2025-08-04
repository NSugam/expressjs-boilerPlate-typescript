import dotenv from "dotenv";
dotenv.config();

if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL environment variable is required");
export const FRONTEND_URL: string = process.env.FRONTEND_URL;

export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const isProduction: boolean = NODE_ENV === "production";

const portEnv = Number(process.env.PORT);
export const PORT: number = !isNaN(portEnv) && portEnv > 0 ? portEnv : 9095;

export const COOKIE_NAME: string = "_ap_";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");
export const JWT_SECRET: string = process.env.JWT_SECRET;

export const connectionString: string = isProduction
	? process.env.MONGODB_SERVER ||
	  (() => {
			throw new Error("MONGODB_SERVER not set");
	  })()
	: "mongodb://localhost:27017/MyGallery";

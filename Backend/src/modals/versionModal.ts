import * as mongoose from "mongoose";
// var mongoose = require("mongoose")

const versionSchema = new mongoose.Schema(
	{
		app: { type: String, default: "motomate" },
		build_type: { type: String, default: "stable" },
		version: { type: String, default: "3.0.1" },
		versionCode: { type: String, default: "301" },
	},
	{ timestamps: true }
);
var versionModel = mongoose.model("version-control", versionSchema);

export default versionModel;

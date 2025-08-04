import * as mongoose from "mongoose";
// var mongoose = require("mongoose")

const otpDataSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		unique: true,
		required: true,
	},
	otpCode: {
		type: String,
		required: true,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
});

const otpDataModel = mongoose.model("OTP", otpDataSchema);
export default otpDataModel;

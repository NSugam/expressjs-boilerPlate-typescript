import * as mongoose from "mongoose";
import { Query } from "mongoose";

const userDataSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true, required: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true },
		phone: String,
		password: String,
		ExpoToken: { type: String },
		role: { type: String, default: "user" },
		verified: { type: Boolean, default: false },
		deleted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

//always finds user with deleted: false
userDataSchema.pre(/^find/, function (this: Query<any, any>, next) {
	this.where({ deleted: false });
	next();
});

const userDataModel = mongoose.model("User", userDataSchema);
export default userDataModel;

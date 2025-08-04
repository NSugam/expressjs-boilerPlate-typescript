const Joi = require("joi");

export const registerSchema = Joi.object({
	username: Joi.string()
		.min(4)
		.max(30)
		.required()
		.messages({ "string.min": "Username must be 4 to 32 characters" }),

	fullName: Joi.string(),

	phone: Joi.number(),

	email: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z]+.[a-zA-Z]{2,}$"))
		.required()
		.messages({ "string.pattern.base": "Email format is invalid" }),

	password: Joi.string().min(6).max(32).required(),

	ExpoToken: Joi.string(),
});

export const loginSchema = Joi.object({
	email: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z]+.[a-zA-Z]{2,}$"))
		.required()
		.messages({ "string.pattern.base": "Email format is invalid" }),

	password: Joi.string()
		.min(6)
		.required()
		.messages({ "string.min": "Password must be at least 6 characters" }),

	rememberMe: Joi.boolean().required(),
});

export const DeleteAccountSchema = Joi.object({
	email: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z]+.[a-zA-Z]{2,}$"))
		.required()
		.messages({ "string.pattern.base": "Email format is invalid" }),

	password: Joi.string()
		.min(6)
		.required()
		.messages({ "string.min": "Password must be at least 6 characters" }),
});

export const fileUploadSchema = Joi.object({
	uploadedFile: Joi.object({
		originalname: Joi.string().required(),
		mimetype: Joi.string().required(),
		size: Joi.number().required(),
	})
		.unknown(true) // allow extra fields like encoding, destination, etc.
		.required(),
});

export const multipleFilesSchema = Joi.object({
	uploadedFiles: Joi.array()
		.items(
			Joi.object({
				originalname: Joi.string().required(),
				mimetype: Joi.string().required(),
				size: Joi.number().required(),
			}).unknown(true)
		)
		.min(1)
		.required(),
});

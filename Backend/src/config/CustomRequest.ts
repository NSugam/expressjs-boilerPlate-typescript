import { Request } from "express";

export interface User {
	username: string;
	fullName: string;
	email: string;
	phone?: string | null;
	role: string;
	verified: boolean;
	deleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface RequestwithAuth extends Request {
	user: User;
}

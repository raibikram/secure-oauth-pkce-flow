import { Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string; // Optional — not set for OAuth users
    avatar?: string;   // Profile picture URL from OAuth provider
    role: "USER" | "ADMIN";
    provider?: "local" | "google" | "github" | "facebook";
    providerId?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Google user info endpoint response shape
export interface IGoogleUserInfo {
    sub: string;        // Google's unique user ID
    name: string;
    email: string;
    picture: string;
    email_verified: boolean;
}

export interface ITokenPayload {
    _id: string;
    name: string;
    email: string;
    role: string;
}

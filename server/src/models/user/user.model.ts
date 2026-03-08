import { model, Schema } from "mongoose";
import { IUser } from "../../types";

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: false, // Not required for OAuth users
            select: false, // Don't return password hash by default
        },
        avatar: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    { timestamps: true }
);

const User = model<IUser>("User", UserSchema);

export default User;

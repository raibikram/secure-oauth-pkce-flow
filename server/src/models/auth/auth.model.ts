import { model, Schema, Types } from "mongoose";
import { IAuth } from "../../types";



const AuthSchema = new Schema<IAuth>(
    {
        provider: {
            type: String,
            enum: ["google", "github", "facebook"],
            required: true,
        },
        providerId: {
            type: String,
            required: true,
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Auth = model<IAuth>("Auth", AuthSchema);

export default Auth;
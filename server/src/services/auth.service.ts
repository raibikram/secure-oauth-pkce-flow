import User from "../models/user/user.model";
import Auth from "../models/auth/auth.model";
import { IGoogleUserInfo } from "../types";

export class AuthService {
    /**
     * Finds an existing user by Google provider ID, or creates a new user
     * and associated Auth record if one doesn't exist.
     * Uses upsert semantics to avoid race conditions.
     */
    static async findOrCreateUserFromGoogle(profile: IGoogleUserInfo) {
        // 1. Check if we already have an Auth record for this Google account
        const existingAuth = await Auth.findOne({
            provider: "google",
            providerId: profile.sub,
        });

        if (existingAuth) {
            // User exists — return populated user doc
            const user = await User.findById(existingAuth.userId).lean();
            if (!user) {
                throw new Error("Auth record found but user document is missing");
            }
            return user;
        }

        // 2. No OAuth record — check if there's a user with this email (e.g. email/password account)
        let user = await User.findOne({ email: profile.email }).lean();

        if (!user) {
            // 3. Brand-new user — create user document
            const newUser = new User({
                name: profile.name,
                email: profile.email,
                avatar: profile.picture,
                role: "USER",
                // password intentionally omitted for OAuth users
            });
            user = (await newUser.save()).toObject();
        }

        // 4. Create Auth record linking this Google account to the user
        await Auth.create({
            provider: "google",
            providerId: profile.sub,
            userId: user._id,
        });

        return user;
    }
}

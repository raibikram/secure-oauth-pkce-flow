import User from "../models/user/user.model";
import { IGoogleUserInfo } from "../types";

export class AuthService {
    /**
     * Finds an existing user by Google provider ID, or creates a new user
     * if one doesn't exist.
     */
    static async findOrCreateUserFromGoogle(profile: IGoogleUserInfo) {
        // 1. Check if user exists by providerId for google
        let user = await User.findOne({
            provider: "google",
            providerId: profile.sub,
        }).lean();

        if (user) {
            return user;
        }

        // 2. Fallback: check if there's a user with this email (if they signed up via email before)
        user = await User.findOne({ email: profile.email }).lean();

        if (user) {
            // Update existing email/password user to include Google auth linking
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                {
                    provider: "google",
                    providerId: profile.sub,
                    avatar: user.avatar || profile.picture // Only update avatar if none exists
                },
                { new: true }
            ).lean();

            if (!updatedUser) {
                throw new Error("Failed to link Google account to existing user");
            }

            return updatedUser;
        }

        // 3. Brand-new user — create user document
        const newUser = new User({
            name: profile.name,
            email: profile.email,
            avatar: profile.picture,
            role: "USER",
            provider: "google",
            providerId: profile.sub
            // password intentionally omitted for OAuth users
        });

        user = (await newUser.save()).toObject();
        return user;
    }
}

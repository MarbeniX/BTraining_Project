import { Request, Response } from "express";
import User from "../models/user";
import Token from "../models/token";
import cloudinary from "../config/cloudinary";
import { comparePasswords, hashPassword } from "../utils/passwordSecurity";
import { generateAndSendToken } from "../utils/reUseCode/tokenService";
import { ProfileEmails } from "../emails/profileEmails";
import { usernameBlackList } from "../utils/blackList";
import { uploadCloudinaryMulter } from "../utils/reUseCode/uploadToCloudinaryMulter";

export class ProfileController {
    static createUsername = async (req: Request, res: Response) => {
        try {
            const { username, name } = req.body;
            if (!username) {
                const error = new Error("Username is required");
                return res.status(400).send({ error: error.message });
            }
            const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(username);
            if (!isUsername) {
                const error = new Error("Username invalid");
                return res.status(400).send({ error: error.message });
            }
            if (usernameBlackList.includes(username.toLowerCase())) {
                const error = new Error("Username not allowed");
                return res.status(400).send({ error: error.message });
            }
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                const error = new Error("Username already taken");
                return res.status(400).send({ error: error.message });
            }
            req.user.name = name;
            req.user.username = username;
            await req.user.save();
            res.status(200).json({ message: "Username created" });
        } catch (err) {
            res.status(500).json({ message: "Server error: Create username" });
        }
    };

    static changePassword = async (req: Request, res: Response) => {
        const { currentPassword, newPassword } = req.body;
        try {
            const userExists = await User.findById(req.user._id);
            if (!userExists) {
                const error = new Error("User not found");
                return res.status(404).send({ error: error.message });
            }
            if (currentPassword === newPassword) {
                const error = new Error(
                    "New password must be different from the current password"
                );
                return res.status(400).send({ error: error.message });
            }
            const passwordMatches = await comparePasswords(
                currentPassword,
                userExists.password
            );
            if (!passwordMatches) {
                const error = new Error("Current password is incorrect");
                return res.status(400).send({ error: error.message });
            }
            userExists.password = await hashPassword(newPassword);
            await userExists.save();
            ProfileEmails.sendChangePasswordEmail({ email: userExists.email });
            res.status(200).json({ message: "Password changed successfully" });
        } catch (err) {
            res.status(500).json({ message: "Server error: Change password" });
        }
    };

    static askChangeEmail = async (req: Request, res: Response) => {
        try {
            const { newEmail, currentPassword } = req.body;
            const tokenExists = await Token.findOne({ user: req.user._id });
            if (tokenExists) {
                const error = new Error(
                    "You have a pending email change request. Please check your email. You can request a new token after 10 minutes"
                );
                return res.status(400).send({ error: error.message });
            }
            if (newEmail === req.user.email) {
                const error = new Error(
                    "New email cannot be the same as the current email"
                );
                return res.status(400).send({ error: error.message });
            }
            const emailInUse = await User.findOne({ email: newEmail });
            if (emailInUse) {
                const error = new Error("Email is already in use");
                return res.status(400).send({ error: error.message });
            }
            const userExists = await User.findById(req.user._id);
            if (!userExists) {
                const error = new Error("User not found");
                return res.status(404).send({ error: error.message });
            }
            const passwordMatches = await comparePasswords(
                currentPassword,
                userExists.password
            );
            if (!passwordMatches) {
                const error = new Error("Current password is incorrect");
                return res.status(400).send({ error: error.message });
            }
            userExists.pendingEmail = newEmail;
            await generateAndSendToken(
                req.user._id,
                req.user.email,
                "changeEmail",
                newEmail
            );
            await userExists.save();
            res.status(200).json({ message: "Change email confirmation sent" });
        } catch (err) {
            res.status(500).json({ message: "Server error: Change email" });
        }
    };

    static changeEmail = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error("Invalid or expired token");
                return res.status(400).send({ error: error.message });
            }
            const userExists = await User.findById(tokenExists.user);
            if (!userExists) {
                const error = new Error("User not found");
                return res.status(404).send({ error: error.message });
            }
            if (!userExists.pendingEmail) {
                const error = new Error("No pending email change");
                return res.status(400).send({ error: error.message });
            }
            ProfileEmails.sendConfirmationChangeEmailToOldEmailEmail({
                email: userExists.email,
                payload: userExists.pendingEmail,
            });
            ProfileEmails.sendConfirmationChangeEmailToNewEmailEmail({
                email: userExists.pendingEmail,
                payload: userExists.pendingEmail,
            });
            userExists.email = userExists.pendingEmail;
            userExists.pendingEmail = null;
            await Promise.allSettled([
                userExists.save(),
                tokenExists.deleteOne(),
            ]);
            res.status(200).json({ message: "Email changed successfully" });
        } catch (err) {
            res.status(500).json({ message: "Server error: Change email" });
        }
    };

    static changeAvatar = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                const error = new Error("No file uploaded");
                res.status(400).send({ error: error.message });
            }
            const userExists = await User.findById(req.user._id);
            if (!userExists) {
                const error = new Error("User not found");
                res.status(400).send({ error: error.message });
            }
            if (userExists.profileImageId) {
                await cloudinary.destroy(userExists.profileImageId);
            }
            const result = await uploadCloudinaryMulter(req.file, {
                folder: "avatars",
                width: 150,
                height: 150,
                crop: "fill",
            });
            userExists.profileImageUrl = result.secure_url;
            userExists.profileImageId = result.public_id;
            await userExists.save();
            res.status(200).json({
                message: "Profile picture succesfully updated",
            });
        } catch (err) {
            res.status(500).json({ message: "Server error: Change avatar" });
        }
    };
}

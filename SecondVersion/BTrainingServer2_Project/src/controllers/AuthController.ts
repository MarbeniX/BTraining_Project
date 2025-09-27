import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import Token from "../models/token";
import User from "../models/user";
import { generateJWT } from "../utils/jwt";
import { comparePasswords, hashPassword } from "../utils/passwordSecurity";
import { generateAndSendToken } from "../utils/reUseCode/tokenService";
import { AuthEmails } from "../emails/authEmails";
import { validateEmailAndToken } from "../utils/reUseCode/validateEmailAndToken";
import cloudinary from "../config/cloudinary";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
    static localRegister = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error("Email already in use");
                return res.status(400).send({ error: error.message });
            }
            const newUser = new User({ email, password });
            newUser.password = await hashPassword(password);

            generateAndSendToken(newUser.id, email, "confirmation");
            await newUser.save();
            res.status(201).json({ message: "User registered" });
        } catch (err) {
            res.status(500).json({ message: "Server error: LocalRegister" });
        }
    };

    static authGoogle = async (req: Request, res: Response) => {
        try {
            const { idToken } = req.body;
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                const error = new Error("Invalid Google token");
                return res.status(400).send({ error: error.message });
            }
            const { sub: googleId, email, name, picture } = payload;

            let user = await User.findOne({ googleId });
            if (!user) {
                user = await User.findOne({ email });
                if (user) {
                    user.googleId = googleId;
                } else {
                    const result = await cloudinary.uploader.upload(picture, {
                        folder: "profile_images",
                        width: 150,
                        height: 150,
                        crop: "fill",
                    });
                    const profileImageUrl = result.secure_url;
                    const profileImageId = result.public_id;
                    user = new User({
                        email,
                        name,
                        googleId,
                        confirmed: true,
                        profileImageUrl,
                        profileImageId,
                    });
                    await user.save();
                }
            }
            const payloadJWT = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
            const jwtToken = generateJWT(payloadJWT);
            res.status(200).json({ token: jwtToken });
        } catch (err) {
            res.status(500).json({ message: "Server error: GoogleRegister" });
        }
    };

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error("Invalid or expired token");
                return res.status(400).send({ error: error.message });
            }
            const user = await User.findById(tokenExists.user);
            if (!user) {
                const error = new Error("User not found");
                return res.status(404).send({ error: error.message });
            }
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            AuthEmails.sendAccountVerifiedEmail({ email: user.email });
            res.status(200).json({ message: "Account confirmed" });
        } catch (err) {
            res.status(500).json({ message: "Server error: Confirm account" });
        }
    };

    static askNewConfirmationToken = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const userExists = await User.findOne({ email });
            const finished = await validateEmailAndToken(res, userExists);
            if (finished) return;
            generateAndSendToken(userExists.id, email, "confirmation");
            res.status(200).json({ message: "New token sent" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Ask new confirmation token",
            });
        }
    };

    static localLogin = async (req: Request, res: Response) => {
        try {
            const { identifier, password } = req.body;
            const isEmail = /\S+@\S+\.\S+/.test(identifier);
            const userExists = await User.findOne(
                isEmail ? { email: identifier } : { username: identifier }
            );
            if (!userExists) {
                const error = new Error("User not found");
                return res.status(404).send({ error: error.message });
            }
            if (!userExists.confirmed) {
                generateAndSendToken(
                    userExists.id,
                    userExists.email,
                    "confirmation"
                );
                const error = new Error("Account not confirmed");
                return res.status(400).send({ error: error.message });
            }
            const isPasswordValid = await comparePasswords(
                password,
                userExists.password
            );
            if (!isPasswordValid) {
                const error = new Error("Invalid password");
                return res.status(400).send({ error: error.message });
            }

            const payload = {
                id: userExists.id,
                email: userExists.email,
                role: userExists.role,
            };
            const jwtToken = generateJWT(payload);
            res.status(200).json({ token: jwtToken });
        } catch (err) {
            res.status(500).json({ message: "Server error: Local login" });
        }
    };

    static askResetPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const userExists = await User.findOne({ email });
            const finished = await validateEmailAndToken(res, userExists);
            if (finished) return;
            generateAndSendToken(userExists.id, email, "resetPassword");
            res.status(200).json({ message: "Reset password email sent" });
        } catch (err) {
            res.status(500).json({ message: "Server error: Reset password" });
        }
    };

    static newPassword = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
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
            userExists.password = await hashPassword(newPassword);
            await Promise.allSettled([
                userExists.save(),
                tokenExists.deleteOne(),
            ]);
            res.status(200).json({ message: "Password updated successfully" });
        } catch (err) {
            res.status(500).json({ message: "Server error: New password" });
        }
    };
}

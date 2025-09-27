import { transporter } from "../config/nodemailer";
import { IRegisterEmail } from "../types";

export class AuthEmails {
    static sendRegisterEmail = async (user: IRegisterEmail) => {
        const info = await transporter.sendMail({
            from: "BClockT <bclockt@gmai.com>",
            to: user.email,
            subject: "BClockT - Confirm your account",
            html: `<h1>Welcome to BClockT</h1>
            <p>Click the link below to confirm your account:</p>
            <a href="${process.env.FRONTEND_URL}/confirm/${user.token}">Confirm Account</a>`,
        });
        console.log("Message sent: %s", info.messageId);
    };

    static sendResetPasswordEmail = async (user: IRegisterEmail) => {
        const info = await transporter.sendMail({
            from: "BClockT <bclockt@gmai.com>",
            to: user.email,
            subject: "BClockT - Reset your password",
            html: `<h1>Password Reset</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${user.token}">Reset Password</a>`,
        });
        console.log("Message sent: %s", info.messageId);
    };

    static sendAccountVerifiedEmail = async (user: IRegisterEmail) => {
        const info = await transporter.sendMail({
            from: "BClockT <bclockt@gmai.com>",
            to: user.email,
            subject: "BClockT - Account Verified",
            html: `<h1>Account Verified</h1>
            <p>Your account has been successfully verified. You can now log in.</p>`,
            //Agregar el link al login
        });
        console.log("Message sent: %s", info.messageId);
    };
}

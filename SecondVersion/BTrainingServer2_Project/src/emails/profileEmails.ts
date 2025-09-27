import { transporter } from "../config/nodemailer";
import { IRegisterEmail } from "../types";

export class ProfileEmails {
    static sendChangeEmailEmail = async (user: IRegisterEmail) => {
        const info = await transporter.sendMail({
            from: "BClockT <bclockt@gmai.com>",
            to: user.email,
            subject: "BClockT - Change your email",
            html: `<h1>Email Change Request</h1>
            <p>Click the link below to confirm your new email address to ${user.payload}:</p>
            <a href="${process.env.FRONTEND_URL}/change-email/${user.token}">Change Email</a>`,
        });
        console.log("Message sent: %s", info.messageId);
    };

    static sendConfirmationChangeEmailToOldEmailEmail = async (
        user: IRegisterEmail
    ) => {
        const info = await transporter.sendMail({
            from: "BClockT <bclockt@gmai.com>",
            to: user.email,
            subject: "BClockT - Email changed",
            html: `<h1>Email Change</h1>
            <p>Your email has been successfully changed to ${user.payload}.</p>
            <p>If you did not make this change, please contact our support immediately.</p>
            `,
        });
        console.log("Message sent: %s", info.messageId);
    };

    static sendConfirmationChangeEmailToNewEmailEmail = async (
        user: IRegisterEmail
    ) => {
        const info = await transporter.sendMail({
            from: "BClockT <bclockt@gmai.com>",
            to: user.email,
            subject: "BClockT - New email confirmed",
            html: `<h1>New Email confirmed</h1>
            <p>Your new email ${user.payload} has been successfully confirmed.</p>
            <p>If you did not make this change, please contact our support immediately.</p>
            `,
        });
        console.log("Message sent: %s", info.messageId);
    };

    static sendChangePasswordEmail = async (user: IRegisterEmail) => {
        const into = await transporter.sendMail({
            from: "BClockT <bclockt@gmai.com>",
            to: user.email,
            subject: "BClockT - Your password has been changed",
            html: `<h1>Password Changed</h1>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this change, please contact our support immediately.</p>
            `,
        });
        console.log("Message sent: %s", into.messageId);
    };
}

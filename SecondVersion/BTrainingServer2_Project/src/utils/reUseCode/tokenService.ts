import Token from "../../models/token";
import { generateToken } from "../generateToken";
import { AuthEmails } from "../../emails/authEmails";
import { ProfileEmails } from "../../emails/profileEmails";

export const generateAndSendToken = async (
    userId,
    userEmail,
    option,
    payload?
) => {
    const newToken = new Token();
    newToken.user = userId;
    newToken.token = generateToken();
    await newToken.save();
    if (option === "confirmation") {
        AuthEmails.sendRegisterEmail({
            email: userEmail,
            token: newToken.token,
        });
    } else if (option === "resetPassword") {
        AuthEmails.sendResetPasswordEmail({
            email: userEmail,
            token: newToken.token,
        });
    } else if (option === "changeEmail") {
        ProfileEmails.sendChangeEmailEmail({
            email: userEmail,
            token: newToken.token,
            payload,
        });
    }
};

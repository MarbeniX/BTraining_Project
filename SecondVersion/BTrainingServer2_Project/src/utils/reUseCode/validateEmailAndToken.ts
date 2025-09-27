import { Response } from "express";
import { IUser } from "../../models/user";
import Token from "../../models/token";
import { generateAndSendToken } from "./tokenService";

export const validateEmailAndToken = async (
    res: Response,
    userExists: IUser
) => {
    if (!userExists) {
        const error = new Error("User not found");
        res.status(404).send({ error: error.message });
        return true;
    }
    if (!userExists.confirmed) {
        generateAndSendToken(userExists.id, userExists.email, "confirmation");
        const error = new Error("Account not confirmed");
        res.status(400).send({ error: error.message });
        return true;
    }
    const tokenExists = await Token.findOne({ user: userExists.id });
    if (tokenExists) {
        const error = new Error(
            "A token has already been sent, please wait 10 minutes before requesting a new one"
        );
        res.status(400).send({ error: error.message });
        return true;
    }
    await Token.deleteMany({ user: userExists.id });
    return false;
};

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith("Bearer")) {
        const error = new Error("No token provided");
        return res.status(401).send({ error: error.message });
    }
    console.log(bearer);
    const [, token] = bearer.split(" ");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "object" && decoded !== null) {
            const findUser = await User.findById(decoded.id).select(
                "_id username email role"
            );
            if (findUser) {
                req.user = findUser;
                next();
            } else {
                const error = new Error("Invalid token");
                return res.status(401).send({ error: error.message });
            }
        }
    } catch (err) {
        const error = new Error("Invalid token");
        return res.status(401).send({ error: error.message });
    }
};

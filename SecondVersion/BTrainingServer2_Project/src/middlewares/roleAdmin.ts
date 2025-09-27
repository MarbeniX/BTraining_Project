import { Request, Response, NextFunction } from "express";

export const requireRoleAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user.role !== "admin") {
        const error = new Error(
            "You do not have permission to perform this action"
        );
        return res.status(403).send({ error: error.message });
    }
    next();
};

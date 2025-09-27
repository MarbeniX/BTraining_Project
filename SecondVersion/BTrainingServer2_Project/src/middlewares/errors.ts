import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleInputErrors = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err: any) => ({
            field: err.param,
            message: err.msg,
        }));
        res.status(400).json({ errors: formattedErrors });
    } else {
        next();
    }
};

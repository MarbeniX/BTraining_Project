import { Request, Response } from "express";
import { IRoutine, Routine } from "../../models/routine";

export const validateRoutineOwnership = async (
    req: Request,
    res: Response,
    routine: IRoutine
) => {
    try {
        if (!routine || routine.isDeleted) {
            const error = new Error("Routine not found");
            res.status(404).send({ error: error.message });
            return false;
        }
        if (routine.user.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: "Access denied" });
            return false;
        }
        return true;
    } catch (err) {
        res.status(500).json({
            message: "Server error: Validate routine ownership",
        });
    }
};

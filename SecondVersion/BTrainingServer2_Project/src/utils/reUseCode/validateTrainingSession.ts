import { Response, Request } from "express";
import TrainingSession from "../../models/trainingSession";

export const validateTrainingSession = async (
    id: string,
    res: Response,
    req: Request
) => {
    try {
        const sessionExists: any = await TrainingSession.findOne({
            _id: id,
        });
        if (!sessionExists || sessionExists.isDeleted) {
            const error = new Error("Training session not found");
            res.status(404).json({ message: error.message });
            return;
        }
        if (sessionExists.user.toString() !== req.user._id.toString()) {
            const error = new Error("You do not own this session");
            res.status(403).json({ message: error.message });
            return;
        }
        return sessionExists;
    } catch (err) {
        res.status(500).json({
            message: "Server error: Validate training session",
        });
    }
};

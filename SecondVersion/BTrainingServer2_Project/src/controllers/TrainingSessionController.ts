import mongoose, { Types } from "mongoose";
import { Response, Request } from "express";
import TrainingExercise, {
    ITrainingExercise,
} from "../models/trainingExercise";
import TrainingSession from "../models/trainingSession";
import { validateTrainingSession } from "../utils/reUseCode/validateTrainingSession";

export class TrainingSessionController {
    static startSession = async (req: Request, res: Response) => {
        try {
            const { routineId } = req.params;
            const newSession = new TrainingSession({
                user: req.user._id,
                routine: routineId ? routineId : null,
            });
            await newSession.save();
            res.status(201).json({
                message: "Training session started successfully",
                sessionId: newSession._id ? newSession._id : null,
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Start training session",
            });
        }
    };

    static finishSession = async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const { sessionExercises } = req.body;
            const sessionExists = await validateTrainingSession(
                sessionId,
                res,
                req
            );
            const exercises = sessionExercises.forEach(
                (exercise: ITrainingExercise) => {
                    const newTrainingExercise = new TrainingExercise({
                        trainingSession: new Types.ObjectId(sessionId),
                        exercise: new Types.ObjectId(exercise.exercise),
                        timeToComplete: exercise.timeToComplete,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        weight: exercise.weight ? exercise.weight : 0,
                        exerciseNumOrder: exercise.exerciseNumOrder,
                        user: req.user._id,
                    });
                    newTrainingExercise.save();
                }
            );
            sessionExists.sessionExercises = exercises;
            await sessionExists.save();
            res.status(200).json({
                message: "Training session finished",
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Finish training session",
            });
        }
    };

    static getTrainingSessions = async (req: Request, res: Response) => {
        try {
            const { date, page = 1, limit = 10, fields, populate } = req.query;

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            const query: any = {};
            if (date) query.date = date;
            query.user = req.user._id;
            query.isDeleted = false;

            let selectedFields = "";
            if (fields) {
                selectedFields = (fields as string).split(",").join(" ");
            }
            let populateOptions: any[] = [];
            if (populate) {
                populateOptions = (populate as string)
                    .split(",")
                    .map((field) => ({
                        path: field.trim(),
                    }));
            }

            const [sessions, total] = await Promise.all([
                TrainingSession.find(query)
                    .select(selectedFields)
                    .populate(populateOptions)
                    .skip(skip)
                    .limit(limitNum)
                    .sort({ createdAt: -1 }),
                TrainingSession.countDocuments(query),
            ]);
            res.status(200).json({
                sessions,
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                hasMore: pageNum * limitNum < total,
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Get training sessions",
            });
        }
    };

    static getTrainingSessionById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const sessionExists = await validateTrainingSession(id, res, req);
            await sessionExists.populate([
                { path: "sessionExercises" },
                { path: "routine" },
            ]);
            res.status(200).json({
                sessionExists,
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Get training session by Id",
            });
        }
    };

    static deleteTraningSession = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const sessionExists = await validateTrainingSession(id, res, req);
            sessionExists.isDeleted = true;
            await sessionExists.save();
            res.status(200).json({
                message: "Training session deleted successfully",
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Delete training session",
            });
        }
    };

    static nonDeleteTrainingSession = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const sessionExists = await TrainingSession.findOne({
                _id: id,
            });
            if (!sessionExists) {
                const error = new Error("Training session not found");
                res.status(404).json({ message: error.message });
                return;
            }
            if (sessionExists.isDeleted === false) {
                const error = new Error("Training session is not deleted");
                res.status(400).json({ message: error.message });
                return;
            }
            sessionExists.isDeleted = false;
            await sessionExists.save();
            res.status(200).json({
                message: "Training session restored successfully",
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Non delete training session",
            });
        }
    };
}

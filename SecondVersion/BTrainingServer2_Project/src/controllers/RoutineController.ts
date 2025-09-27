import { Request, Response } from "express";
import Routine from "../models/routine";
import { validateRoutineOwnership } from "../utils/reUseCode/validateRoutineOwnerhip";

export class RoutineController {
    static createRoutine = async (req: Request, res: Response) => {
        try {
            const { name, description, category, exercises } = req.body;
            const newRoutine = new Routine({
                name,
                description,
                category,
                exercises,
                user: req.user._id,
            });
            await newRoutine.save();
            res.status(201).json({
                message: "Routine created",
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Admin Create routine",
            });
        }
    };

    static getUserRoutines = async (req: Request, res: Response) => {
        try {
            const {
                name,
                category,
                page = "1",
                limit = "6",
                fields = "",
            } = req.query;

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            const query: any = {};
            if (name) query.name = { $regex: name, $options: "i" };
            if (category) query.category = category;
            query.user = req.user._id;
            query.isDeleted = false;

            let selectedFields = "";
            if (fields) {
                selectedFields = (fields as string).split(",").join(" ");
            }
            const [routines, total] = await Promise.all([
                Routine.find(query)
                    .select(selectedFields)
                    .skip(skip)
                    .limit(limitNum),
                Routine.countDocuments(query),
            ]);
            res.status(200).json({
                routines,
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Get user routines",
            });
        }
    };

    static getUserRoutineById = async (req: Request, res: Response) => {
        try {
            const { routineId } = req.params;
            const routineExists = await Routine.findById(routineId);
            const result = await validateRoutineOwnership(
                req,
                res,
                routineExists
            );
            if (!result) {
                return;
            }
            res.status(200).json(routineExists);
        } catch (err) {
            res.status(500).json({
                message: "Server error: Get user routine by id",
            });
        }
    };

    static deleteUserRoutineById = async (req: Request, res: Response) => {
        try {
            const { routineId } = req.params;
            const routineExists = await Routine.findById(routineId);
            const result = await validateRoutineOwnership(
                req,
                res,
                routineExists
            );
            if (!result) {
                return;
            }
            routineExists.isDeleted = true;
            await routineExists.save();
            res.status(200).json({ message: "Routine deleted successfully" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Delete user routine by id",
            });
        }
    };

    static nonDeleteRoutineById = async (req: Request, res: Response) => {
        try {
            const { routineId } = req.params;
            const routineExists = await Routine.findById(routineId);
            if (
                !routineExists ||
                routineExists.user.toString() !== req.user._id.toString()
            ) {
                res.status(403).json({ message: "Access denied" });
                return;
            }
            if (!routineExists.isDeleted) {
                res.status(400).json({ message: "Routine is not deleted" });
                return;
            }
            routineExists.isDeleted = false;
            await routineExists.save();
            res.status(200).json({ message: "Routine restored successfully" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Non delete a routine by Id",
            });
        }
    };

    static updateUserRoutineById = async (req: Request, res: Response) => {
        try {
            const { routineId } = req.params;
            const routineExists = await Routine.findById(routineId);
            const result = await validateRoutineOwnership(
                req,
                res,
                routineExists
            );
            if (!result) {
                return;
            }
            const { name, description, category, exercises } = req.body;
            routineExists.name = name;
            routineExists.description = description;
            routineExists.category = category;
            routineExists.exercises = exercises;
            await routineExists.save();
            res.status(200).json({ message: "Routine updated successfully" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Update user routine by id",
            });
            console.log(err);
        }
    };
}

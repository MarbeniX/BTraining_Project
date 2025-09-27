import { Request, Response } from "express";
import Exercise from "../../models/exercise";
import cloudinary from "../../config/cloudinary";
import { uploadCloudinaryMulter } from "../../utils/reUseCode/uploadToCloudinaryMulter";
import { validateExerciseExists } from "../../utils/reUseCode/validateExerciseExists";

export class ExerciseController {
    static addExercise = async (req: Request, res: Response) => {
        try {
            const { name, description, muscle, level } = req.body;
            if (!req.file) {
                const error = new Error("No file uploaded");
                res.status(400).send({ error: error.message });
            }
            const exerciseExists = await Exercise.findOne({ name });
            if (exerciseExists) {
                const error = new Error(
                    "Exercise with this name already exists"
                );
                return res.status(400).send({ error: error.message });
            }
            const result = await uploadCloudinaryMulter(req.file, {
                folder: "exercises",
                width: 150,
                height: 150,
                crop: "fill",
            });
            const newExercise = new Exercise({
                name,
                description,
                muscle,
                level,
                imageUrl: result.secure_url,
                publicId: result.public_id,
            });
            await newExercise.save();
            res.status(201).json({ message: "Exercise created successfully" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Admin Add exercise",
            });
            console.error(err);
        }
    };

    static editExercise = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description, muscle, level } = req.body;
            const exerciseExists = await validateExerciseExists(res, id);
            if (req.file) {
                await cloudinary.uploader.destroy(exerciseExists.publicId);
                const result = await uploadCloudinaryMulter(req.file, {
                    folder: "exercises",
                    width: 150,
                    height: 150,
                    crop: "fill",
                });
                exerciseExists.imageUrl = result.secure_url;
                exerciseExists.publicId = result.public_id;
            }
            exerciseExists.name = name;
            exerciseExists.description = description;
            exerciseExists.muscle = muscle;
            exerciseExists.level = level;
            await exerciseExists.save();
            res.status(200).json({ message: "Exercise updated successfully" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Admin Edit exercise",
            });
        }
    };

    static deleteExercise = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const exerciseExists = await validateExerciseExists(res, id);
            if (exerciseExists.isDeleted === true) {
                const error = new Error(
                    "Exercise is already marked as deleted"
                );
                return res.status(400).send({ error: error.message });
            }
            exerciseExists.isDeleted = true;
            await exerciseExists.save();
            res.status(200).json({ message: "Exercise marked as deleted" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Admin Delete exercise",
            });
        }
    };

    static nonDeleteExercise = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const exerciseExists = await validateExerciseExists(res, id);
            if (exerciseExists.isDeleted === false) {
                const error = new Error("Exercise is not deleted");
                return res.status(400).send({ error: error.message });
            }
            exerciseExists.isDeleted = false;
            await exerciseExists.save();
            res.status(200).json({ message: "Exercise restored successfully" });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Admin ReDelete exercise",
            });
        }
    };

    static getExercises = async (req: Request, res: Response) => {
        try {
            const {
                muscle,
                level,
                deleted,
                name,
                page = "1",
                limit = "15",
                fields = "",
            } = req.query;
            if (deleted === "true" && req.user.role !== "admin") {
                const error = new Error("Access denied");
                return res.status(403).send({ error: error.message });
            }

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            const query: any = {};
            if (muscle) query.muscle = muscle;
            if (level) query.level = level;
            if (name) query.name = { $regex: name, $options: "i" };

            if (deleted === "true") {
                query.isDeleted = true;
            } else {
                query.isDeleted = false;
            }

            let selectedFields = "";
            if (fields) {
                selectedFields = (fields as string).split(",").join(" ");
            }

            const [exercises, total] = await Promise.all([
                Exercise.find(query)
                    .select(selectedFields)
                    .skip(skip)
                    .limit(limitNum),
                Exercise.countDocuments(query),
            ]);

            res.status(200).json({
                exercises,
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                hasMore: pageNum * limitNum < total,
            });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Admin Get exercises",
            });
        }
    };

    static getExerciseById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fields = "" } = req.query;
            const exerciseExists = await validateExerciseExists(
                res,
                id,
                fields as string
            );
            res.status(200).json({ exercise: exerciseExists });
        } catch (err) {
            res.status(500).json({
                message: "Server error: Admin Get exercise by Id",
            });
        }
    };
}

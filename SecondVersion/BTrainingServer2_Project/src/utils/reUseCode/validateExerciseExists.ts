import Exercise, { IExercise } from "../../models/exercise";
import { Response } from "express";

export const validateExerciseExists = async (
    res: Response,
    id: string,
    fields?: string
) => {
    if (fields) {
        let selectedFields = "";
        selectedFields = fields.split(",").join(" ");
    }
    const exerciseExists: any = await Exercise.findById(id).select(
        fields || ""
    );
    if (!exerciseExists) {
        const error = new Error("Exercise not found");
        res.status(404).send({ error: error.message });
        return;
    }
    return exerciseExists;
};

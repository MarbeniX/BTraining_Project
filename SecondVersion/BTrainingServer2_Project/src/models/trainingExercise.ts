import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITrainingExercise extends Document {
    trainingSession: Types.ObjectId;
    exercise: Types.ObjectId;
    timeToComplete: number;
    sets: number;
    reps: number;
    weight?: number;
    exerciseNumOrder: number;
    user: Types.ObjectId;
    createdAt: Date;
}

export const TrainingExerciseSchea: Schema = new Schema(
    {
        trainingSession: {
            type: Types.ObjectId,
            ref: "TrainingSession",
            required: true,
        },
        exercise: {
            type: Types.ObjectId,
            ref: "Exercise",
            required: true,
        },
        timeToComplete: {
            type: Number,
            required: true,
        },
        sets: {
            type: Number,
            required: true,
        },
        reps: {
            type: Number,
            required: true,
            min: 1,
        },
        weight: {
            type: Number,
            default: 0,
        },
        exerciseNumOrder: {
            type: Number,
            required: true,
            min: 1,
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

export const TrainingExercise = mongoose.model<ITrainingExercise>(
    "TrainingExercise",
    TrainingExerciseSchea
);
export default TrainingExercise;

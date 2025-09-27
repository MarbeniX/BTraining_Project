import mongoose, { Document, Types, Schema } from "mongoose";

export interface ITrainingSession extends Document {
    user: Types.ObjectId;
    routine?: Types.ObjectId;
    isDeleted?: boolean;
    sessionExercises: Types.ObjectId[];
    createdAt: Date;
}

export const TrainingSessionSchema: Schema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        routine: {
            type: Types.ObjectId,
            ref: "Routine",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        sessionExercises: [
            {
                type: Types.ObjectId,
                ref: "SessionExercise",
                required: true,
            },
        ],
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: false },
    }
);

export const TrainingSession = mongoose.model<ITrainingSession>(
    "TrainingSession",
    TrainingSessionSchema
);
export default TrainingSession;

import { Categories, Category } from "../enums/index";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRoutine extends Document {
    name: string;
    description?: string;
    category: [Category];
    exercises: Types.ObjectId[];
    user: Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
}

export const RoutineShema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 50,
        },
        description: {
            type: String,
            trim: true,
            maxLength: 100,
        },
        category: {
            type: [String],
            enum: Object.keys(Categories),
            required: true,
            minLength: 1,
            maxLength: 3,
        },
        exercises: [
            {
                type: Types.ObjectId,
                ref: "Exercise",
                minLength: 1,
                maxLength: 25,
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Routine = mongoose.model<IRoutine>("Routine", RoutineShema);
export default Routine;

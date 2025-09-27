import mongoose, { Document, Schema } from "mongoose";
import { Level, Levels, Muscle, Muscles } from "../enums/index";

export interface IExercise extends Document {
    name: String;
    description: String;
    muscle: Muscle;
    level: Level;
    imageUrl: String;
    publicId: String;
    isDeleted?: Boolean;
}

export const ExerciseSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxLength: 30,
    },
    description: {
        type: String,
        trim: true,
        maxLength: 100,
    },
    muscle: {
        type: String,
        enum: Object.keys(Muscles),
        default: "other",
        required: true,
    },
    level: {
        type: String,
        enum: Object.keys(Levels),
        default: "open",
        required: true,
    },
    imageUrl: {
        type: String,
        trim: true,
        required: true,
    },
    publicId: {
        type: String,
        trim: true,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

export const Exercise = mongoose.model<IExercise>("Exercise", ExerciseSchema);
export default Exercise;

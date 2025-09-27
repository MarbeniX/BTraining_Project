import mongoose, { Schema, Document, Types } from "mongoose";
import { Role, Roles } from "../enums";

export interface IUser extends Document {
    email: string;
    pendingEmail: string;
    username: string;
    password?: string;
    name: string;
    role: Role;
    confirmed: boolean;
    googleId?: string;
    routines: Types.ObjectId[];
    trainingSessions: Types.ObjectId[];
    profileImageUrl: string;
    profileImageId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        pendingEmail: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        username: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            minLength: 6,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
            maxLength: 50,
        },
        role: {
            type: String,
            enum: Roles,
            default: Roles[0],
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        googleId: {
            type: String,
        },
        routines: [
            {
                type: Types.ObjectId,
                ref: "Routine",
            },
        ],
        trainingSessions: [
            {
                type: Types.ObjectId,
                ref: "TrainingSession",
            },
        ],
        profileImageUrl: {
            type: String,
            unique: true,
        },
        profileImageId: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

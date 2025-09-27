import mongoose, { Document, Types, Schema } from "mongoose";

export interface IToken extends Document {
    user: Types.ObjectId;
    token: string;
    createdAt: Date;
}

export const TokenSchema: Schema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // 10 minutes
    },
});

export const Token = mongoose.model<IToken>("Token", TokenSchema);
export default Token;

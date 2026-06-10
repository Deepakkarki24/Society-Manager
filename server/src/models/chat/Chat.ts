import mongoose, { Schema, Document } from "mongoose";

type Role = "user" | "ai"

export interface IChat extends Document {
    sessionId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: "text" | "complaint-card";
    complaint: mongoose.Types.ObjectId;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
    {
        sessionId: {
            type: Schema.Types.ObjectId,
            ref: "ChatSession",
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["text", "complaint-card"],
            required: true,
        },

        complaint: {
            type: Schema.Types.ObjectId,
            ref: "Complaint",
        }
    },
    {
        timestamps: true,
    }
);

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
import mongoose, { Schema, Document } from "mongoose";

type Role = "user" | "ai"

export interface IChat extends Document {
    sessionId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: "text" | "complaint-card";
    complaintId?: mongoose.Types.ObjectId;
    role: Role;

    complaint?: {
        title: string;
        description: string;
        category: string;
        priority: string;
        status: string;
        image?: string;
    };

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

        complaintId: {
            type: Schema.Types.ObjectId,
            ref: "Complaint",
        },

        complaint: {
            title: String,
            description: String,
            category: String,
            priority: String,
            status: String,
            image: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
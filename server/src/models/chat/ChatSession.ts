import mongoose, { Schema } from "mongoose";

const ChatSessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            default: "New Chat",
        },
    },
    {
        timestamps: true,
    }
);

export const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);
import mongoose from "mongoose";

const querySchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
  image: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const query = mongoose.model("Query", querySchema);

export default query;

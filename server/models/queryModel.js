import mongoose from "mongoose";

const querySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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
  image: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const query = mongoose.model("Query", querySchema);

export default query;

import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  society: mongoose.Types.ObjectId;
  submittedBy: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  rating?: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    society: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    category: { type: String, default: 'general' },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);

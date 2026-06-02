import mongoose, { Document, Schema } from 'mongoose';
import {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types';

export interface IComplaintComment {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IComplaintTimeline {
  status: ComplaintStatus;
  note?: string;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  society: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  images: string[];
  completionProof: string[];
  comments: IComplaintComment[];
  timeline: IComplaintTimeline[];
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComplaintComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const timelineSchema = new Schema<IComplaintTimeline>(
  {
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'resolved', 'reopened'],
      required: true,
    },
    note: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const complaintSchema = new Schema<IComplaint>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'water',
        'electricity',
        'security',
        'lift',
        'parking',
        'cleaning',
        'maintenance',
        'other',
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'resolved', 'reopened'],
      default: 'pending',
    },
    society: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    images: [String],
    completionProof: [String],
    comments: [commentSchema],
    timeline: [timelineSchema],
    resolvedAt: Date,
  },
  { timestamps: true }
);

complaintSchema.index({ society: 1, status: 1 });
complaintSchema.index({ createdBy: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ title: 'text', description: 'text' });

export const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema);

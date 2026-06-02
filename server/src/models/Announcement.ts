import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  society: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isImportant: boolean;
  isEvent: boolean;
  eventDate?: Date;
  attachments: string[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    society: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isImportant: { type: Boolean, default: false },
    isEvent: { type: Boolean, default: false },
    eventDate: Date,
    attachments: [String],
    expiresAt: Date,
  },
  { timestamps: true }
);

announcementSchema.index({ society: 1, createdAt: -1 });

export const Announcement = mongoose.model<IAnnouncement>(
  'Announcement',
  announcementSchema
);

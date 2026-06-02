import mongoose, { Document, Schema } from 'mongoose';

export interface ISociety extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalFlats: number;
  contactEmail?: string;
  contactPhone?: string;
  logo?: string;
  maintenanceAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const societySchema = new Schema<ISociety>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    totalFlats: { type: Number, required: true, min: 1 },
    contactEmail: String,
    contactPhone: String,
    logo: String,
    maintenanceAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

societySchema.index({ name: 'text', city: 'text' });

export const Society = mongoose.model<ISociety>('Society', societySchema);

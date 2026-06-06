// import mongoose, { Document, Schema } from 'mongoose';
// import { VisitorStatus } from '../types';

// export interface IVisitor extends Document {
//   name: string;
//   phone: string;
//   purpose: string;
//   vehicleNumber?: string;
//   idProof?: string;
//   society: mongoose.Types.ObjectId;
//   hostResident: mongoose.Types.ObjectId;
//   flatNumber: string;
//   status: VisitorStatus;
//   expectedArrival?: Date;
//   checkInAt?: Date;
//   checkOutAt?: Date;
//   verifiedBy?: mongoose.Types.ObjectId;
//   notes?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const visitorSchema = new Schema<IVisitor>(
//   {
//     name: { type: String, required: true, trim: true },
//     phone: { type: String, required: true },
//     purpose: { type: String, required: true },
//     vehicleNumber: String,
//     idProof: String,
//     society: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
//     hostResident: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     flatNumber: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ['pre_approved', 'checked_in', 'checked_out', 'rejected'],
//       default: 'pre_approved',
//     },
//     expectedArrival: Date,
//     checkInAt: Date,
//     checkOutAt: Date,
//     verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
//     notes: String,
//   },
//   { timestamps: true }
// );

// visitorSchema.index({ society: 1, status: 1 });
// visitorSchema.index({ hostResident: 1 });

// export const Visitor = mongoose.model<IVisitor>('Visitor', visitorSchema);

// import mongoose, { Document, Schema } from 'mongoose';
// import { PaymentStatus } from '../types';

// export interface IPayment extends Document {
//   society: mongoose.Types.ObjectId;
//   resident: mongoose.Types.ObjectId;
//   amount: number;
//   month: number;
//   year: number;
//   status: PaymentStatus;
//   dueDate: Date;
//   paidAt?: Date;
//   transactionId?: string;
//   paymentMethod?: string;
//   notes?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const paymentSchema = new Schema<IPayment>(
//   {
//     society: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
//     resident: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     amount: { type: Number, required: true, min: 0 },
//     month: { type: Number, required: true, min: 1, max: 12 },
//     year: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ['pending', 'paid', 'overdue', 'partial'],
//       default: 'pending',
//     },
//     dueDate: { type: Date, required: true },
//     paidAt: Date,
//     transactionId: String,
//     paymentMethod: String,
//     notes: String,
//   },
//   { timestamps: true }
// );

// paymentSchema.index({ society: 1, month: 1, year: 1 });
// paymentSchema.index({ resident: 1, status: 1 });
// paymentSchema.index(
//   { society: 1, resident: 1, month: 1, year: 1 },
//   { unique: true }
// );

// export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

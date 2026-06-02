import mongoose, { Document } from 'mongoose';
import { PaymentStatus } from '../types';
export interface IPayment extends Document {
    society: mongoose.Types.ObjectId;
    resident: mongoose.Types.ObjectId;
    amount: number;
    month: number;
    year: number;
    status: PaymentStatus;
    dueDate: Date;
    paidAt?: Date;
    transactionId?: string;
    paymentMethod?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Payment: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, {}> & IPayment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Payment.d.ts.map
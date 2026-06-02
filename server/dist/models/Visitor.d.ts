import mongoose, { Document } from 'mongoose';
import { VisitorStatus } from '../types';
export interface IVisitor extends Document {
    name: string;
    phone: string;
    purpose: string;
    vehicleNumber?: string;
    idProof?: string;
    society: mongoose.Types.ObjectId;
    hostResident: mongoose.Types.ObjectId;
    flatNumber: string;
    status: VisitorStatus;
    expectedArrival?: Date;
    checkInAt?: Date;
    checkOutAt?: Date;
    verifiedBy?: mongoose.Types.ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Visitor: mongoose.Model<IVisitor, {}, {}, {}, mongoose.Document<unknown, {}, IVisitor, {}, {}> & IVisitor & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Visitor.d.ts.map
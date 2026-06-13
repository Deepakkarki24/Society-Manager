import mongoose, { Document } from 'mongoose';
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../types';
export interface IComplaintComment {
    user: mongoose.Types.ObjectId;
    text: string;
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
    image: string;
    completionProof: string[];
    comments: IComplaintComment[];
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Complaint: mongoose.Model<IComplaint, {}, {}, {}, mongoose.Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Complaint.d.ts.map
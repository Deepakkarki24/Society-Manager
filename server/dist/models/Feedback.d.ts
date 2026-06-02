import mongoose, { Document } from 'mongoose';
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
export declare const Feedback: mongoose.Model<IFeedback, {}, {}, {}, mongoose.Document<unknown, {}, IFeedback, {}, {}> & IFeedback & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Feedback.d.ts.map
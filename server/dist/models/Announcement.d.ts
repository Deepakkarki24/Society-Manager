import mongoose, { Document } from 'mongoose';
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
export declare const Announcement: mongoose.Model<IAnnouncement, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncement, {}, {}> & IAnnouncement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Announcement.d.ts.map
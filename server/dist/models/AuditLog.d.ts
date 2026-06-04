import mongoose, { Document } from "mongoose";
export interface IAuditLog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    entity: string;
    entityId?: mongoose.Types.ObjectId;
    society?: mongoose.Types.ObjectId;
    details?: Record<string, unknown>;
    ip?: string;
    createdAt: Date;
}
export declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AuditLog.d.ts.map
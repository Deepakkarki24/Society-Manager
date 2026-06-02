import mongoose, { Document } from 'mongoose';
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
export declare const Society: mongoose.Model<ISociety, {}, {}, {}, mongoose.Document<unknown, {}, ISociety, {}, {}> & ISociety & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Society.d.ts.map
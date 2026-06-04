import mongoose, { Document } from "mongoose";
import { UserRole } from "../types";
export interface IFamilyMember {
    name: string;
    relation: string;
    phone?: string;
    age?: number;
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    society?: mongoose.Types.ObjectId;
    flatNumber?: string;
    block?: string;
    avatar?: string;
    isActive: boolean;
    familyMembers: IFamilyMember[];
    comparePassword(candidate: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map
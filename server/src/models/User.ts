import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
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

const familyMemberSchema = new Schema<IFamilyMember>(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: String,
    age: Number,
  },
  { _id: true },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["super_admin", "society_admin", "resident", "maintenance_staff"],
      required: true,
    },
    society: { type: Schema.Types.ObjectId, ref: "Society" },
    flatNumber: String,
    block: String,
    avatar: String,
    isActive: { type: Boolean, default: true },
    familyMembers: [familyMemberSchema],
  },
  { timestamps: true },
);

userSchema.index({ society: 1, role: 1 });
// userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);

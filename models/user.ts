import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  role: "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true },
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;

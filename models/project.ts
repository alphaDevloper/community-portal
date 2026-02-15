import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink?: string;
  imageUrl: string;
  userId: mongoose.Types.ObjectId;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    githubLink: { type: String, required: true },
    liveLink: { type: String },
    imageUrl: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;

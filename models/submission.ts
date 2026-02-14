import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISubmission extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  githubLink: string;
  fileUrl?: string;
  explanation: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    githubLink: { type: String, required: true },
    fileUrl: { type: String },
    explanation: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    feedback: { type: String },
  },
  { timestamps: true },
);

const Submission =
  models.Submission || model<ISubmission>("Submission", SubmissionSchema);

export default Submission;

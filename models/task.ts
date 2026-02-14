import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  deadline: Date;
  techStack: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    deadline: { type: Date, required: true },
    techStack: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;

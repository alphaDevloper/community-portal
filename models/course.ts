import mongoose, { Schema, Document, model, models } from "mongoose";

interface ILesson {
  lessonNumber: number;
  title: string;
  videoUrl?: string;
  content: string;
  resources: { title: string; url: string }[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  category: "Frontend" | "Backend" | "Full Stack";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  lessons: ILesson[];
  techStack: string[];
  enrolledUsers: mongoose.Types.ObjectId[];
  published: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, default: "Abdullah Alam" },
    thumbnail: { type: String, required: true },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Full Stack"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: String, required: true },
    lessons: [
      {
        lessonNumber: { type: Number, required: true },
        title: { type: String, required: true },
        videoUrl: { type: String },
        content: { type: String, required: true },
        resources: [
          {
            title: { type: String, required: true },
            url: { type: String, required: true },
          },
        ],
      },
    ],
    techStack: { type: [String], default: [] },
    enrolledUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    published: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Course = models.Course || model<ICourse>("Course", CourseSchema);

export default Course;

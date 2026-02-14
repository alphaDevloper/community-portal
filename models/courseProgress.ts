import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICourseProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: number[];
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: { type: [Number], default: [] },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

// One progress record per user per course
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseProgress =
  models.CourseProgress ||
  model<ICourseProgress>("CourseProgress", CourseProgressSchema);

export default CourseProgress;

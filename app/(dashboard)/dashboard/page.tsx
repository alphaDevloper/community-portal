import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your personal DevHub dashboard — track your tasks, projects, courses, and community activity.",
};
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/task";
import Submission from "@/models/submission";
import Project from "@/models/project";
import Course from "@/models/course";
import CourseProgress from "@/models/courseProgress";
import { getCurrentUser } from "@/lib/auth";
import {
  ClipboardList,
  CheckCircle2,
  FolderOpen,
  BookOpen,
  Trophy,
  Target,
} from "lucide-react";

export default async function DashboardPage() {
  await connectToDatabase();
  const user = await getCurrentUser();

  let totalTasks = 0;
  let completedSubmissions = 0;
  let approvedProjects = 0;
  let enrolledCourses = 0;
  let completedCourses = 0;
  let pendingSubmissions = 0;

  if (user) {
    // Total available tasks
    totalTasks = await Task.countDocuments({});

    // User's approved submissions
    completedSubmissions = await Submission.countDocuments({
      userId: user._id,
      status: "approved",
    });

    // User's pending submissions
    pendingSubmissions = await Submission.countDocuments({
      userId: user._id,
      status: "pending",
    });

    // User's approved projects
    approvedProjects = await Project.countDocuments({
      userId: user._id,
      approved: true,
    });

    // Courses the user is enrolled in
    enrolledCourses = await Course.countDocuments({
      enrolledUsers: user._id,
    });

    // Courses completed
    completedCourses = await CourseProgress.countDocuments({
      userId: user._id,
      completed: true,
    });
  }

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Tasks Completed",
      value: completedSubmissions,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Pending Reviews",
      value: pendingSubmissions,
      icon: Target,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Approved Projects",
      value: approvedProjects,
      icon: FolderOpen,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      label: "Enrolled Courses",
      value: enrolledCourses,
      icon: BookOpen,
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      label: "Courses Completed",
      value: completedCourses,
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-bold">
          Welcome back{user ? `, ${user.name}` : ""}! 👋
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Here&apos;s what&apos;s happening in the community today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

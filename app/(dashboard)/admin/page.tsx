import React from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel",
  description:
    "DevHub Admin Portal — manage tasks, review submissions, approve projects, and create courses.",
};
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import SubmissionReviewDialog from "@/components/SubmissionReviewDialog";
import CreateCourseDialog from "@/components/CreateCourseDialog";
import AddLessonDialog from "@/components/AddLessonDialog";
import ApproveProjectButton from "@/components/ApproveProjectButton";
import DeleteItemButton from "@/components/DeleteItemButton";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/task";
import Submission from "@/models/submission";
import Project from "@/models/project";
import Course from "@/models/course";
import User from "@/models/user";
import PublishCourseButton from "@/components/PublishCourseButton";
import {
  Users,
  ClipboardList,
  Send,
  CheckCircle2,
  FolderOpen,
  FolderCheck,
  BookOpen,
  BookCheck,
} from "lucide-react";

export default async function AdminPanelPage() {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    redirect("/dashboard");
  }

  // Query MongoDB directly from the Server Component
  await connectToDatabase();

  const tasks = JSON.parse(
    JSON.stringify(
      await Task.find({}).populate("createdBy", "name").sort({ createdAt: -1 }),
    ),
  );
  const submissions = JSON.parse(
    JSON.stringify(
      await Submission.find({})
        .populate("taskId", "title difficulty")
        .populate("userId", "name email")
        .sort({ createdAt: -1 }),
    ),
  );
  const projects = JSON.parse(
    JSON.stringify(
      await Project.find({})
        .populate("userId", "name email")
        .sort({ createdAt: -1 }),
    ),
  );
  const courses = JSON.parse(
    JSON.stringify(
      await Course.find({})
        .populate("createdBy", "name")
        .select("-enrolledUsers")
        .sort({ createdAt: -1 }),
    ),
  );

  const totalUsers = await User.countDocuments({});
  const totalTasks = tasks.length;
  const totalSubmissions = submissions.length;
  const approvedSubmissions = submissions.filter(
    (s: any) => s.status === "approved",
  ).length;
  const totalProjects = projects.length;
  const approvedProjects = projects.filter((p: any) => p.approved).length;
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c: any) => c.published).length;

  const stats = [
    {
      label: "Registered Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "rounded-lg bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ClipboardList,
      color: "text-amber-600",
      bg: "rounded-lg bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Total Submissions",
      value: totalSubmissions,
      icon: Send,
      color: "text-violet-600",
      bg: "rounded-lg bg-violet-100 dark:bg-violet-900/30",
    },
    {
      label: "Approved Submissions",
      value: approvedSubmissions,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "rounded-lg bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderOpen,
      color: "text-orange-600",
      bg: "rounded-lg bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "Approved Projects",
      value: approvedProjects,
      icon: FolderCheck,
      color: "text-emerald-600",
      bg: "rounded-lg bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "text-cyan-600",
      bg: "rounded-lg bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      label: "Published Courses",
      value: publishedCourses,
      icon: BookCheck,
      color: "text-teal-600",
      bg: "rounded-lg bg-teal-100 dark:bg-teal-900/30",
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Admin Panel
        </h2>
        <p className="text-sm sm:text-base text-zinc-600">
          Manage community content, tasks, projects, and courses.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center ${stat.bg}`}
              >
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-auto">
          <TabsTrigger
            value="tasks"
            className="text-xs sm:text-sm px-1 sm:px-3 py-2"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="text-xs sm:text-sm px-1 sm:px-3 py-2"
          >
            Submissions
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="text-xs sm:text-sm px-1 sm:px-3 py-2"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="text-xs sm:text-sm px-1 sm:px-3 py-2"
          >
            Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Task Management
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Create and manage community tasks for students.
                </CardDescription>
              </div>
              <CreateTaskDialog />
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Title</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Deadline
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.length > 0 ? (
                      tasks.map((task: any) => (
                        <TableRow key={task._id}>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.difficulty === "beginner"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {task.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {format(new Date(task.deadline), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>Active</TableCell>
                          <TableCell>
                            <DeleteItemButton
                              itemId={task._id}
                              endpoint="/api/tasks"
                              itemName="task"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-zinc-500"
                        >
                          No tasks created yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Reviews</CardTitle>
              <CardDescription>
                Review student submissions and provide feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Student</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Task
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.length > 0 ? (
                      submissions.map((sub: any) => (
                        <TableRow key={sub._id}>
                          <TableCell>{sub.userId?.name || "Unknown"}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {sub.taskId?.title || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                sub.status === "approved"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <SubmissionReviewDialog submission={sub} />
                              <DeleteItemButton
                                itemId={sub._id}
                                endpoint="/api/submissions"
                                itemName="submission"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-zinc-500"
                        >
                          No submissions to review.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Approvals</CardTitle>
              <CardDescription>
                Review and approve student projects for the showcase.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Project</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Student
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.length > 0 ? (
                      projects.map((proj: any) => (
                        <TableRow key={proj._id}>
                          <TableCell>{proj.title}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {proj.userId?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={proj.approved ? "default" : "secondary"}
                            >
                              {proj.approved ? "Approved" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {!proj.approved && (
                                <ApproveProjectButton projectId={proj._id} />
                              )}
                              <DeleteItemButton
                                itemId={proj._id}
                                endpoint="/api/projects"
                                itemName="project"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-zinc-500"
                        >
                          No projects to review.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Course Management
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Create and manage courses for students.
                </CardDescription>
              </div>
              <CreateCourseDialog />
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Title</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Difficulty
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Lessons
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length > 0 ? (
                      courses.map((course: any) => (
                        <TableRow key={course._id}>
                          <TableCell className="font-medium">
                            {course.title}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline">{course.category}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant={
                                course.difficulty === "beginner"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {course.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">
                              {course.lessons?.length || 0} lessons
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                course.published ? "default" : "secondary"
                              }
                            >
                              {course.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                              <AddLessonDialog
                                courseId={course._id}
                                lessonCount={course.lessons?.length || 0}
                              />
                              <PublishCourseButton
                                courseId={course._id}
                                published={course.published}
                              />
                              <DeleteItemButton
                                itemId={course._id}
                                endpoint="/api/courses"
                                itemName="course"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-zinc-500"
                        >
                          No courses created yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

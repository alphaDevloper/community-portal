import React from "react";
import type { Metadata } from "next";

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
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
        <p className="text-zinc-600">
          Manage community content, tasks, projects, and courses.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
              <div
                className={`flex h-10 w-10 items-center justify-center ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>
                  Create and manage community tasks for students.
                </CardDescription>
              </div>
              <CreateTaskDialog />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Deadline</TableHead>
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
                        <TableCell>
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
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.length > 0 ? (
                    submissions.map((sub: any) => (
                      <TableRow key={sub._id}>
                        <TableCell>{sub.userId?.name || "Unknown"}</TableCell>
                        <TableCell>{sub.taskId?.title || "Unknown"}</TableCell>
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
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map((proj: any) => (
                      <TableRow key={proj._id}>
                        <TableCell>{proj.title}</TableCell>
                        <TableCell>{proj.userId?.name || "Unknown"}</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>
                  Create and manage courses for students.
                </CardDescription>
              </div>
              <CreateCourseDialog />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Lessons</TableHead>
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
                        <TableCell>
                          <Badge variant="outline">{course.category}</Badge>
                        </TableCell>
                        <TableCell>
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
                        <TableCell>
                          <Badge variant="outline">
                            {course.lessons?.length || 0} lessons
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={course.published ? "default" : "secondary"}
                          >
                            {course.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

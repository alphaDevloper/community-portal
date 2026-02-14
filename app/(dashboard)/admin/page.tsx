import React from "react";
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
import PublishCourseButton from "@/components/PublishCourseButton";

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
        <p className="text-zinc-600">
          Manage community content, tasks, projects, and courses.
        </p>
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
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
                          <SubmissionReviewDialog submission={sub} />
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
                          {!proj.approved && (
                            <Button variant="outline" size="sm">
                              Approve
                            </Button>
                          )}
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

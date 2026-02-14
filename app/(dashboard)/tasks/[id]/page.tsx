"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Code, Github, Loader2, Send } from "lucide-react";
import { format } from "date-fns";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/tasks`)
      .then((res) => res.json())
      .then((data) => {
        const tasks = data.tasks || [];
        const foundTask = tasks.find((t: any) => t._id === id);
        setTask(foundTask);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      taskId: id,
      githubLink: formData.get("githubLink"),
      explanation: formData.get("explanation"),
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/submissions");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Badge
            variant={
              task.difficulty === "beginner"
                ? "secondary"
                : task.difficulty === "intermediate"
                  ? "default"
                  : "destructive"
            }
          >
            {task.difficulty}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">{task.title}</h2>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Calendar className="h-4 w-4" />
            Deadline: {format(new Date(task.deadline), "MMMM d, yyyy")}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                {task.description}
              </p>

              <div className="mt-8">
                <h4 className="mb-4 font-semibold">Technologies Required</h4>
                <div className="flex flex-wrap gap-2">
                  {task.techStack.map((tech: string) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="gap-1 px-3 py-1"
                    >
                      <Code className="h-3 w-3" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Your Work</CardTitle>
              <CardDescription>
                Provide your GitHub repository link and a brief explanation of
                your implementation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      name="githubLink"
                      placeholder="https://github.com/username/repo"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Implementation Details
                  </label>
                  <Textarea
                    name="explanation"
                    placeholder="Briefly describe your approach, features implemented, and any challenges faced..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {submitting ? "Submitting..." : "Submit Task"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Status</span>
                <span className="font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Submissions</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Category</span>
                <span className="font-medium">Development</span>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400">
                  Make sure your repository is public or you've invited Abdullah
                  Alam as a contributor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Code } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderIcon className="h-16 w-16 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Available Tasks</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Select a task to get started on your development journey.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task: any) => (
          <Card
            key={task._id}
            className="overflow-hidden bg-white dark:bg-zinc-900"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.deadline), "MMM d, yyyy")}
                </div>
              </div>
              <CardTitle className="mt-4 text-xl">{task.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {task.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap gap-2">
                {task.techStack.map((tech: string) => (
                  <div
                    key={tech}
                    className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    <Code className="h-3 w-3" />
                    {tech}
                  </div>
                ))}
              </div>
              <Link href={`/tasks/${task._id}`}>
                <Button className="w-full group">
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

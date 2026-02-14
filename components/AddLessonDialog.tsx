"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddLessonDialog({
  courseId,
  lessonCount,
}: {
  courseId: string;
  lessonCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newLesson = {
      lessonNumber: lessonCount + 1,
      title: formData.get("title"),
      videoUrl: formData.get("videoUrl"),
      content: formData.get("content"),
      resources: [], // Simplified for now
    };

    try {
      // We'll use the course update API to push a lesson
      // First get current course to get existing lessons
      const courseRes = await fetch(`/api/courses/${courseId}`);
      const courseData = await courseRes.json();
      const course = courseData.course;

      const updatedLessons = [...(course.lessons || []), newLesson];

      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessons: updatedLessons }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Lesson to Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lesson Title</label>
            <Input name="title" placeholder="Introduction to React" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Video URL (YouTube/Vimeo)
            </label>
            <Input
              name="videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Content (Markdown supported)
            </label>
            <Textarea
              name="content"
              placeholder="Write lesson content here..."
              className="min-h-[200px]"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Add Lesson"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Layers, Clock } from "lucide-react";
import Link from "next/link";
import { getThumbnailUrl } from "@/lib/utils/thumbnail";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-96 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-4xl font-bold tracking-tight">
          Structured Courses
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Learn real-world skills through guided projects and expert
          instruction.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course: any) => (
          <Card
            key={course._id}
            className="group overflow-hidden border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="relative aspect-video">
              <img
                src={getThumbnailUrl(course.thumbnail)}
                alt={course.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-black backdrop-blur-sm hover:bg-white">
                  {course.category}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <Layers className="h-3 w-3" />
                {course.difficulty}
                <Clock className="ml-2 h-3 w-3" />
                {course.duration}
              </div>
              <CardTitle className="mt-2 text-2xl group-hover:text-blue-600 transition-colors">
                {course.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.techStack.slice(0, 3).map((tech: string) => (
                  <Badge key={tech} variant="outline" className="font-normal">
                    {tech}
                  </Badge>
                ))}
                {course.techStack.length > 3 && (
                  <span className="text-xs text-zinc-400">
                    +{course.techStack.length - 3} more
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-100 p-4 dark:border-zinc-800">
              <Link href={`/courses/${course._id}`} className="w-full">
                <Button className="w-full gap-2 font-semibold">
                  <BookOpen className="h-4 w-4" />
                  View Course
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <GraduationCap className="h-12 w-12 text-zinc-300" />
          <p className="text-zinc-500">
            Coming soon! Exciting courses are being prepared.
          </p>
        </div>
      )}
    </div>
  );
}

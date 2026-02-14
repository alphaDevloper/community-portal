"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { getThumbnailUrl } from "@/lib/utils/thumbnail";

interface CourseWithProgress {
  _id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  lessons: any[];
  progress?: {
    completedCount: number;
    totalLessons: number;
    percentage: number;
    completed: boolean;
  };
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesWithProgress = async () => {
      try {
        const res = await fetch("/api/courses/my-courses");
        const data = await res.json();
        const courseList = data.courses || [];

        // Fetch progress for each course
        const coursesWithProgress = await Promise.all(
          courseList.map(async (course: any) => {
            try {
              const progressRes = await fetch(
                `/api/courses/${course._id}/progress`,
              );
              if (progressRes.ok) {
                const progressData = await progressRes.json();
                return { ...course, progress: progressData.progress };
              }
            } catch {
              // Ignore progress fetch errors
            }
            return course;
          }),
        );

        setCourses(coursesWithProgress);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesWithProgress();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Learning</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Continue where you left off and master new skills.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const percentage = course.progress?.percentage || 0;
          const completedCount = course.progress?.completedCount || 0;
          const totalLessons =
            course.progress?.totalLessons || course.lessons?.length || 0;
          const isCompleted = course.progress?.completed || false;

          return (
            <Card
              key={course._id}
              className={`overflow-hidden transition-all ${
                isCompleted
                  ? "ring-2 ring-amber-300 dark:ring-amber-700"
                  : "bg-white dark:bg-zinc-900"
              }`}
            >
              <div className="relative aspect-video">
                <img
                  src={getThumbnailUrl(course.thumbnail)}
                  className="h-full w-full object-cover"
                  alt={course.title}
                />
                {isCompleted && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500 text-white gap-1 shadow-lg">
                      <Trophy className="h-3 w-3" />
                      Completed
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                  <Link href={`/courses/${course._id}`}>
                    <Button variant="secondary" size="sm">
                      {isCompleted ? "Review" : "Continue"}
                    </Button>
                  </Link>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">
                  {course.title}
                </CardTitle>
                <CardDescription>{course.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-500">
                      {completedCount}/{totalLessons} lessons
                    </span>
                    <span
                      className={
                        isCompleted
                          ? "text-emerald-600"
                          : "text-zinc-900 dark:text-zinc-100"
                      }
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        isCompleted
                          ? "bg-gradient-to-r from-emerald-500 to-green-400"
                          : percentage > 50
                            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                            : "bg-gradient-to-r from-violet-500 to-purple-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/courses/${course._id}`} className="w-full">
                  <Button variant="outline" className="w-full text-xs h-8">
                    {isCompleted ? "Review Course" : "Continue Learning"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
        {courses.length === 0 && (
          <Card className="col-span-full py-12 text-center border-dashed">
            <CardContent className="space-y-4">
              <Trophy className="mx-auto h-12 w-12 text-zinc-300" />
              <div>
                <CardTitle>No courses yet</CardTitle>
                <CardDescription>
                  Enroll in a course to start your learning journey.
                </CardDescription>
              </div>
              <Link href="/courses">
                <Button variant="default">Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

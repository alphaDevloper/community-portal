"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlayCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Trophy,
  Circle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getThumbnailUrl } from "@/lib/utils/thumbnail";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();
        const courseData = data.course;
        setCourse(courseData);
        setIsEnrolled(courseData?.isEnrolled || false);

        // Fetch progress if enrolled
        if (courseData?.isEnrolled) {
          const progressRes = await fetch(`/api/courses/${id}/progress`);
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            setProgress(progressData.progress);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${id}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        setIsEnrolled(true);
        // Fetch progress after enrolling
        const progressRes = await fetch(`/api/courses/${id}/progress`);
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData.progress);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteCourse = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/courses/${id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completeCourse: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  if (!course) return <div>Course not found</div>;

  const totalLessons = course.lessons?.length || 0;
  const completedLessons = progress?.completedLessons || [];
  const completedCount = progress?.completedCount || 0;
  const percentage = progress?.percentage || 0;
  const isCourseCompleted = progress?.completed || false;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4 lg:max-w-2xl">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.difficulty}</Badge>
            {isCourseCompleted && (
              <Badge className="bg-amber-500 text-white gap-1">
                <Trophy className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            {course.title}
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {course.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Instructor:
              </span>
              {course.instructor}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Duration:
              </span>
              {course.duration}
            </div>
          </div>
        </div>

        <Card className="shrink-0 overflow-hidden lg:w-80 shadow-xl">
          <img
            src={getThumbnailUrl(course.thumbnail)}
            alt={course.title}
            className="aspect-video w-full object-cover"
          />
          <CardHeader>
            <CardTitle>{isEnrolled ? "Your Progress" : "Enroll Now"}</CardTitle>
            <CardDescription>
              {isEnrolled
                ? `${completedCount} of ${totalLessons} lessons completed`
                : "Get lifetime access to this course."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEnrolled ? (
              <>
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Progress
                    </span>
                    <span
                      className={
                        percentage === 100
                          ? "text-emerald-600"
                          : "text-zinc-900 dark:text-zinc-100"
                      }
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        percentage === 100
                          ? "bg-gradient-to-r from-emerald-500 to-green-400"
                          : percentage > 50
                            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                            : "bg-gradient-to-r from-violet-500 to-purple-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Complete Course Button */}
                {!isCourseCompleted && totalLessons > 0 && (
                  <Button
                    onClick={handleCompleteCourse}
                    disabled={completing}
                    className="w-full gap-2 h-12 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    {completing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trophy className="h-5 w-5" />
                    )}
                    {completing ? "Completing..." : "Complete Course"}
                  </Button>
                )}

                {isCourseCompleted && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Course completed! 🎉
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Button
                  className="w-full gap-2 h-12 text-lg font-bold"
                  disabled={enrolling}
                  onClick={handleEnroll}
                >
                  {enrolling ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  {enrolling ? "Enrolling..." : "Join Course"}
                </Button>
                <p className="text-center text-xs text-zinc-400">
                  Free for all community members.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Banner for enrolled users */}
      {isEnrolled && progress && !isCourseCompleted && (
        <div className="rounded-xl border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-5 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-lg">
                {percentage}%
              </div>
              <div>
                <p className="font-semibold">Keep going!</p>
                <p className="text-sm text-zinc-500">
                  You&apos;ve completed {completedCount} of {totalLessons}{" "}
                  lessons
                </p>
              </div>
            </div>
            {completedCount < totalLessons && (
              <Link
                href={`/courses/${id}/lessons/${
                  course.lessons.find(
                    (l: any) => !completedLessons.includes(l.lessonNumber),
                  )?.lessonNumber || 1
                }`}
              >
                <Button size="sm" className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Continue
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Course Completed Banner */}
      {isCourseCompleted && (
        <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 dark:from-amber-950/30 dark:to-yellow-950/30 dark:border-amber-700">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-amber-800 dark:text-amber-300">
                🎉 Course Completed!
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Congratulations! You&apos;ve mastered all {totalLessons} lessons
                in this course.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Curriculum */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Course Curriculum</h3>
            {isEnrolled && (
              <span className="text-sm text-zinc-500">
                {completedCount}/{totalLessons} completed
              </span>
            )}
          </div>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {(course.lessons || []).map((lesson: any, index: number) => {
              const isLessonCompleted = completedLessons.includes(
                lesson.lessonNumber,
              );
              return (
                <AccordionItem
                  key={lesson._id || index}
                  value={`lesson-${index}`}
                  className={`rounded-lg border px-4 transition-colors ${
                    isLessonCompleted
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
                      : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4 text-left">
                      {/* Lesson number circle with checkmark */}
                      {isLessonCompleted ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold dark:bg-zinc-900">
                          {lesson.lessonNumber}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{lesson.title}</p>
                        <p className="text-xs text-zinc-500">
                          {isLessonCompleted
                            ? "✓ Completed"
                            : "Lesson Video & Resources"}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-6">
                    <div className="flex flex-col gap-4 pl-12">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {lesson.content?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4">
                        {isEnrolled ? (
                          <Link
                            href={`/courses/${id}/lessons/${lesson.lessonNumber}`}
                          >
                            <Button size="sm" className="gap-2">
                              <PlayCircle className="h-4 w-4" />
                              {isLessonCompleted
                                ? "Review Lesson"
                                : "Watch Lesson"}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-2 text-zinc-400"
                            disabled
                          >
                            <Lock className="h-4 w-4" />
                            Enroll to Watch
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {(!course.lessons || course.lessons.length === 0) && (
            <div className="text-center py-12 bg-zinc-50 rounded-xl dark:bg-zinc-900">
              <p className="text-zinc-500">
                Curriculum is currently being updated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

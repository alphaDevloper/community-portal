"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  Circle,
  Loader2,
  LoaderIcon,
  Trophy,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

function getYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function VideoPlayer({ url }: { url: string }) {
  const ytId = getYouTubeId(url);

  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
        title="Lesson Video"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video src={url} controls className="h-full w-full">
      Your browser does not support the video tag.
    </video>
  );
}

export default function LessonPage() {
  const { id, lessonNumber } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          fetch(`/api/courses/${id}`),
          fetch(`/api/courses/${id}/progress`),
        ]);
        const courseData = await courseRes.json();
        setCourse(courseData.course || null);

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData.progress);
          const lessonNum = parseInt(lessonNumber as string);
          setIsCompleted(
            progressData.progress?.completedLessons?.includes(lessonNum) ||
              false,
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, lessonNumber]);

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      const res = await fetch(`/api/courses/${id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonNumber: parseInt(lessonNumber as string),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsCompleted(true);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMarking(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderIcon className="h-16 w-16 animate-spin text-zinc-400" />
      </div>
    );
  if (!course) return <div className="p-8">Course not found</div>;

  const lessons = course.lessons || [];
  const currentLessonIndex = lessons.findIndex(
    (l: any) => l.lessonNumber === parseInt(lessonNumber as string),
  );
  const lesson = lessons[currentLessonIndex];

  if (!lesson) return <div className="p-8">Lesson not found</div>;

  const nextLesson = lessons[currentLessonIndex + 1];
  const prevLesson = lessons[currentLessonIndex - 1];
  const totalLessons = lessons.length;
  const completedLessons = progress?.completedLessons || [];
  const completedCount = progress?.completedCount || 0;
  const percentage = progress?.percentage || 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-zinc-500">
        <Link
          href={`/courses/${id}`}
          className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors truncate max-w-[150px] sm:max-w-none"
        >
          {course.title}
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate">
          Lesson {lessonNumber}: {lesson.title}
        </span>
      </div>

      {/* Overall Course Progress Bar */}
      {progress && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-zinc-500">
            <span>
              {completedCount} of {totalLessons} lessons completed
            </span>
            <span
              className={percentage === 100 ? "text-emerald-600 font-bold" : ""}
            >
              {percentage}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                percentage === 100
                  ? "bg-gradient-to-r from-emerald-500 to-green-400"
                  : "bg-gradient-to-r from-violet-500 to-purple-400"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main Content */}
        <div className="space-y-6 min-w-0">
          {/* Video Player */}
          <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-black aspect-video shadow-2xl">
            {lesson.videoUrl ? (
              <VideoPlayer url={lesson.videoUrl} />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                No video available for this lesson.
              </div>
            )}
          </div>

          {/* Prev/Next Navigation — Prominent */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
            {prevLesson ? (
              <Link
                href={`/courses/${id}/lessons/${prevLesson.lessonNumber}`}
                className="flex-1 min-w-0"
              >
                <Button variant="outline" className="w-full gap-2 h-11">
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Previous:</span>{" "}
                  <span className="truncate">{prevLesson.title}</span>
                </Button>
              </Link>
            ) : (
              <Button variant="outline" className="flex-1 gap-2 h-11" disabled>
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>Previous Lesson</span>
              </Button>
            )}
            {nextLesson ? (
              <Link
                href={`/courses/${id}/lessons/${nextLesson.lessonNumber}`}
                className="flex-1 min-w-0"
              >
                <Button className="w-full gap-2 h-11">
                  <span className="hidden sm:inline">Next:</span>{" "}
                  <span className="truncate">{nextLesson.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Button>
              </Link>
            ) : (
              <Button className="flex-1 gap-2 h-11" disabled>
                <span>Next Lesson</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Button>
            )}
          </div>

          {/* Mark Complete Button */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            {isCompleted ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Lesson Completed!
                  </p>
                  <p className="text-sm text-zinc-500">
                    {nextLesson
                      ? "Great work! Continue to the next lesson."
                      : "You've finished the last lesson! 🎉"}
                  </p>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleMarkComplete}
                disabled={marking}
                className="w-full gap-2 h-12 text-base bg-emerald-600 hover:bg-emerald-700"
              >
                {marking ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                {marking ? "Marking..." : "Mark Lesson as Complete"}
              </Button>
            )}
          </div>

          {/* Course Completed Banner */}
          {progress?.completed && (
            <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 dark:from-amber-950/30 dark:to-yellow-950/30 dark:border-amber-700">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="font-bold text-lg text-amber-800 dark:text-amber-300">
                    🎉 Course Completed!
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Congratulations! You&apos;ve completed all lessons in this
                    course.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="prose prose-zinc dark:prose-invert max-w-none overflow-x-auto">
              <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
          </div>

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h4 className="font-bold mb-4">Resources</h4>
              <div className="space-y-2">
                {lesson.resources.map((res: any, i: number) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-zinc-100 p-3 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <Download className="h-4 w-4 text-zinc-400" />
                    <span className="flex-1 truncate">{res.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar — Module Progress */}
        <div className="space-y-4 min-w-0 order-first lg:order-none">
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:sticky lg:top-4">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-zinc-500" />
                <h4 className="font-bold text-sm">Course Modules</h4>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {completedCount}/{totalLessons} completed
              </p>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {lessons.map((l: any, idx: number) => {
                const isActive =
                  l.lessonNumber === parseInt(lessonNumber as string);
                const isDone = completedLessons.includes(l.lessonNumber);

                return (
                  <Link
                    key={l._id || idx}
                    href={`/courses/${id}/lessons/${l.lessonNumber}`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                      isActive
                        ? "bg-zinc-50 dark:bg-zinc-900 border-l-2 border-violet-500"
                        : ""
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : isActive ? (
                      <div className="h-5 w-5 shrink-0 rounded-full border-2 border-violet-500 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-violet-500" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-zinc-300 dark:text-zinc-600" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`truncate ${
                          isActive
                            ? "font-semibold text-violet-700 dark:text-violet-400"
                            : isDone
                              ? "text-zinc-500 line-through decoration-emerald-400"
                              : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {l.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
              <Link href={`/courses/${id}`}>
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Back to Overview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

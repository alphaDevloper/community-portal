import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/course";
import CourseProgress from "@/models/courseProgress";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const progress = await CourseProgress.findOne({
      userId: user._id,
      courseId: id,
    });

    const totalLessons = course.lessons?.length || 0;
    const completedLessons = progress?.completedLessons || [];
    const completedCount = completedLessons.length;
    const percentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return NextResponse.json({
      progress: {
        completedLessons,
        completedCount,
        totalLessons,
        percentage,
        completed: progress?.completed || false,
        completedAt: progress?.completedAt || null,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/courses/[id]/progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if user is enrolled
    const isEnrolled = course.enrolledUsers?.some(
      (uid: any) => uid.toString() === user._id.toString(),
    );
    if (!isEnrolled) {
      return NextResponse.json(
        { error: "You must be enrolled in this course" },
        { status: 403 },
      );
    }

    const body = await req.json();

    // Mark entire course as complete
    if (body.completeCourse) {
      const allLessonNumbers = course.lessons.map((l: any) => l.lessonNumber);
      const progress = await CourseProgress.findOneAndUpdate(
        { userId: user._id, courseId: id },
        {
          completedLessons: allLessonNumbers,
          completed: true,
          completedAt: new Date(),
        },
        { upsert: true, new: true },
      );

      return NextResponse.json({
        success: true,
        message: "Course marked as complete!",
        progress: {
          completedLessons: progress.completedLessons,
          completedCount: progress.completedLessons.length,
          totalLessons: course.lessons.length,
          percentage: 100,
          completed: true,
          completedAt: progress.completedAt,
        },
      });
    }

    // Mark a specific lesson as complete
    const { lessonNumber } = body;
    if (lessonNumber === undefined) {
      return NextResponse.json(
        { error: "lessonNumber is required" },
        { status: 400 },
      );
    }

    // Validate lesson exists
    const lessonExists = course.lessons.some(
      (l: any) => l.lessonNumber === lessonNumber,
    );
    if (!lessonExists) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const progress = await CourseProgress.findOneAndUpdate(
      { userId: user._id, courseId: id },
      { $addToSet: { completedLessons: lessonNumber } },
      { upsert: true, new: true },
    );

    const totalLessons = course.lessons.length;
    const completedCount = progress.completedLessons.length;
    const percentage = Math.round((completedCount / totalLessons) * 100);

    // Auto-complete course if all lessons are done
    let courseCompleted = progress.completed;
    if (completedCount === totalLessons && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
      await progress.save();
      courseCompleted = true;
    }

    return NextResponse.json({
      success: true,
      progress: {
        completedLessons: progress.completedLessons,
        completedCount,
        totalLessons,
        percentage,
        completed: courseCompleted,
        completedAt: progress.completedAt || null,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/courses/[id]/progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

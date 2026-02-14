import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/course";
import { getCurrentUser } from "@/lib/auth";

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

    if (!course.published) {
      return NextResponse.json(
        { error: "Cannot enroll in an unpublished course" },
        { status: 400 },
      );
    }

    // Check if already enrolled
    const isAlreadyEnrolled = course.enrolledUsers?.includes(user._id);
    if (isAlreadyEnrolled) {
      return NextResponse.json(
        {
          success: false,
          message: "Already enrolled in this course",
        },
        { status: 400 },
      );
    }

    // Add user to enrolledUsers
    await Course.findByIdAndUpdate(id, {
      $addToSet: { enrolledUsers: user._id },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    console.error("Error in POST /api/courses/[id]/enroll:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

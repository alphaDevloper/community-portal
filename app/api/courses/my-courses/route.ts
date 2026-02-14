import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/course";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all courses where enrolledUsers contains the current user's ID
    const courses = await Course.find({ enrolledUsers: user._id })
      .select("-lessons -enrolledUsers") // List view without full details
      .sort({ updatedAt: -1 });

    const formattedCourses = courses.map((course: any) => ({
      _id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      lessonsCount: course.lessons?.length || 0,
      // progress: 0 // Placeholder for v1
    }));

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error("Error in GET /api/courses/my-courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/course";
import { getAuthUser, isAdmin, getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIsAdmin = await isAdmin();
    let query: any = {};

    if (all && userIsAdmin) {
      query = {}; // All courses for admin
    } else {
      query = { published: true }; // Only published for members
    }

    const courses = await Course.find(query)
      .populate("createdBy", "name")
      .select("-lessons -enrolledUsers") // Lightweight list view
      .sort({ createdAt: -1 });

    // Format for response
    const formattedCourses = courses.map((course: any) => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      thumbnail: course.thumbnail,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      techStack: course.techStack,
      published: course.published,
      lessonsCount: course.lessons?.length || 0,
      enrolledCount: course.enrolledUsers?.length || 0,
      createdAt: course.createdAt,
    }));

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error("Error in GET /api/courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      thumbnail,
      techStack,
    } = body;

    if (
      !title ||
      !description ||
      !category ||
      !difficulty ||
      !duration ||
      !thumbnail ||
      !techStack
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newCourse = await Course.create({
      title,
      description,
      category,
      difficulty,
      duration,
      thumbnail,
      techStack,
      published: false,
      createdBy: user._id,
    });

    return NextResponse.json(
      { success: true, course: newCourse },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

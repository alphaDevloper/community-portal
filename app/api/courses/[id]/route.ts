import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Course from "@/models/course";
import { isAdmin, getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const user = await getCurrentUser();
    const userIsAdmin = await isAdmin();

    const course = await Course.findById(id).populate("createdBy", "name");

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!course.published && !userIsAdmin) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const enrolledCount = course.enrolledUsers?.length || 0;
    const isEnrolled = user ? course.enrolledUsers?.includes(user._id) : false;

    // Remove enrolledUsers from sensitive response
    const courseData = course.toObject();
    delete courseData.enrolledUsers;

    return NextResponse.json({
      course: {
        ...courseData,
        enrolledCount,
        isEnrolled,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/courses/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const updatedCourse = await Course.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error("Error in PATCH /api/courses/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/courses/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Submission from "@/models/submission";
import { isAdmin } from "@/lib/auth";

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
    const { status, feedback } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true },
    )
      .populate("taskId", "title")
      .populate("userId", "name email");

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, submission: updatedSubmission });
  } catch (error) {
    console.error("Error in PATCH /api/submissions/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submission = await Submission.findById(id);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    if (submission.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own submissions" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { githubLink, explanation } = body;

    if (!githubLink || !explanation) {
      return NextResponse.json(
        { error: "GitHub link and explanation are required" },
        { status: 400 },
      );
    }

    submission.githubLink = githubLink;
    submission.explanation = explanation;
    await submission.save();

    const updated = await Submission.findById(id)
      .populate("taskId", "title")
      .populate("userId", "name email");

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("Error in PUT /api/submissions/[id]:", error);
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

    const deleted = await Submission.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/submissions/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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

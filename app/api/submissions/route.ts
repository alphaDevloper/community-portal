import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Submission from "@/models/submission";
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

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    const userIsAdmin = await isAdmin();
    let query: any = {};

    if (all && userIsAdmin) {
      query = {}; // All submissions for admin
    } else {
      query = { userId: user._id }; // Only their submissions for members
    }

    const submissions = await Submission.find(query)
      .populate("taskId", "title difficulty")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error in GET /api/submissions:", error);
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

    const body = await req.json();
    const { taskId, githubLink, explanation } = body;

    if (!taskId || !githubLink || !explanation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Optional: Check if already submitted
    const existingSubmission = await Submission.findOne({
      taskId,
      userId: user._id,
    });
    if (existingSubmission) {
      return NextResponse.json(
        {
          error:
            "You have already submitted this task. Please wait for review or contact admin for resubmission.",
        },
        { status: 400 },
      );
    }

    const newSubmission = await Submission.create({
      taskId,
      userId: user._id,
      githubLink,
      explanation,
      status: "pending",
    });

    return NextResponse.json(
      { success: true, submission: newSubmission },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/task";
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
    let query = {};

    // Filter for members if they don't have 'all' param or aren't admin
    // For now, since there's no 'published' flag in Task model, we return all tasks
    // unless the logic evolves to include a status field.
    if (!userIsAdmin || !all) {
      query = {}; // In the future: { status: 'active' }
    }

    const tasks = await Task.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error in GET /api/tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { title, description, difficulty, deadline, techStack } = body;

    if (!title || !description || !difficulty || !deadline || !techStack) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newTask = await Task.create({
      title,
      description,
      difficulty,
      deadline: new Date(deadline),
      techStack,
      createdBy: user._id,
    });

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

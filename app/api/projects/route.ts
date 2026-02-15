import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/project";
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
      query = {}; // All projects for admin
    } else {
      query = { approved: true }; // Only approved projects for public/members
    }

    const projects = await Project.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
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
    const { title, description, techStack, githubLink, imageUrl, liveLink } =
      body;

    if (!title || !description || !techStack || !githubLink) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newProject = await Project.create({
      title,
      description,
      techStack,
      githubLink,
      imageUrl,
      liveLink,
      userId: user._id,
      approved: false, // Requires admin approval
    });

    return NextResponse.json(
      { success: true, project: newProject },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { auth, clerkClient } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = (user.publicMetadata as { role?: string })?.role || "member";

    return { userId, role };
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
}

export async function isAdmin() {
  const authUser = await getAuthUser();
  return authUser?.role === "admin";
}

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  await connectToDatabase();
  let user = await User.findOne({ clerkId: userId });

  // Auto-sync: if user doesn't exist in MongoDB, create them from Clerk data
  if (!user) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const name =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "User";
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const role =
        (clerkUser.publicMetadata as { role?: string })?.role || "member";

      user = await User.findOneAndUpdate(
        { clerkId: userId },
        { clerkId: userId, name, email, role },
        { upsert: true, new: true },
      );
    } catch (error) {
      console.error("Error auto-syncing user to MongoDB:", error);
      return null;
    }
  }

  return user;
}

export async function getCurrentUserWithRole() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    // Get MongoDB user
    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: userId });

    // Get role from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const role = (clerkUser.publicMetadata as { role?: string })?.role;

    return {
      ...dbUser?.toObject(),
      role: role || "member",
    };
  } catch (error) {
    console.error("Error fetching user with role:", error);
    return null;
  }
}

import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CheckSquare,
  Send,
  FolderSearch,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { isAdmin } from "@/lib/auth";
import MobileSidebar from "@/components/MobileSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      iconName: "LayoutDashboard",
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      iconName: "CheckSquare",
    },
    {
      label: "My Submissions",
      href: "/submissions",
      icon: Send,
      iconName: "Send",
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderSearch,
      iconName: "FolderSearch",
    },
    {
      label: "Courses",
      href: "/courses",
      icon: BookOpen,
      iconName: "BookOpen",
    },
  ];

  if (admin) {
    navItems.push({
      label: "Admin Panel",
      href: "/admin",
      icon: ShieldCheck,
      iconName: "ShieldCheck",
    });
  }

  const mobileNavItems = navItems.map(({ label, href, iconName }) => ({
    label,
    href,
    iconName,
  }));

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:block">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black">
            <span className="font-bold underline">D</span>
          </div>
          <span className="text-xl font-bold">DevHub</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <MobileSidebar navItems={mobileNavItems} />
              <h1 className="text-lg font-semibold">Community Dashboard</h1>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

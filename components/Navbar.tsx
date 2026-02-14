"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-zinc-200/50 bg-white/80 py-3 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/80"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            DevHub
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#home"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            About
          </Link>
          {/* <Link
            href="#features"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Features
          </Link> */}
          <Link
            href="/courses"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Courses
          </Link>
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Showcase
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Show when user is NOT signed in */}
          <SignedOut>
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex cursor-pointer"
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full px-6 cursor-pointer">
                Join Community
              </Button>
            </Link>
          </SignedOut>

          {/* Show when user IS signed in */}
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex cursor-pointer"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

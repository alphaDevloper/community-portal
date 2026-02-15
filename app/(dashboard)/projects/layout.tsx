import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Showcase",
  description:
    "Discover and showcase amazing projects built by DevHub community members. Submit your own project for review.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description:
    "Browse and complete coding tasks to sharpen your skills and earn recognition in the DevHub community.",
};

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

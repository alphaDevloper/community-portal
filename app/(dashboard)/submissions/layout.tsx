import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Submissions",
  description:
    "Track your task submissions, review statuses, and feedback from the DevHub admin team.",
};

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

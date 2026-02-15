"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Github } from "lucide-react";
import EditSubmissionDialog from "@/components/EditSubmissionDialog";

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data.submissions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdated = (updated: any) => {
    setSubmissions((prev) =>
      prev.map((s) => (s._id === updated._id ? updated : s)),
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Submissions</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Track the status of your task submissions and read feedback from
          reviewers.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>GitHub Link</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub: any) => (
              <TableRow key={sub._id}>
                <TableCell className="font-medium">
                  {sub.taskId?.title}
                </TableCell>
                <TableCell>
                  {format(new Date(sub.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <a
                    href={sub.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    View Code
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      sub.status === "approved"
                        ? "default"
                        : sub.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-zinc-500">
                  {sub.feedback || "Awaiting review..."}
                </TableCell>
                <TableCell>
                  <EditSubmissionDialog
                    submission={sub}
                    onUpdated={handleUpdated}
                  />
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-zinc-500"
                >
                  No submissions yet. Go to Tasks to find something to work on!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

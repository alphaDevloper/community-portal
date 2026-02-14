"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
  Github,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubmissionReviewDialog({
  submission,
}: {
  submission: any;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  const handleUpdate = async (status: "approved" | "rejected") => {
    setLoading(true);

    try {
      const res = await fetch(`/api/submissions/${submission._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, feedback }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Student
            </h4>
            <p>
              {submission.userId?.name} ({submission.userId?.email})
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Implementation Explanation
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
              {submission.explanation}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Links
            </h4>
            <a
              href={submission.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <Github className="h-4 w-4" />
              GitHub Repository
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Reviewer Feedback
            </h4>
            <Textarea
              placeholder="Good job on the layout! Consider adding more validation..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={loading}
              onClick={() => handleUpdate("rejected")}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Reject
            </Button>
            <Button
              className="gap-2 bg-green-600 hover:bg-green-700"
              disabled={loading}
              onClick={() => handleUpdate("approved")}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

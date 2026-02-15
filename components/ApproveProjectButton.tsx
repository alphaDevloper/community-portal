"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ApproveProjectButton({
  projectId,
}: {
  projectId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });

      if (res.ok) {
        setApproved(true);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to approve project");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (approved) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="gap-1 text-emerald-600"
      >
        <CheckCircle2 className="h-4 w-4" />
        Approved
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleApprove}
      disabled={loading}
      className="gap-1"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      {loading ? "Approving..." : "Approve"}
    </Button>
  );
}

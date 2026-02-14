"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Globe,
  Image as ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";

export default function AddProjectPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      githubLink: formData.get("githubLink"),
      liveLink: formData.get("liveLink"),
      imageUrl: formData.get("imageUrl"),
      techStack: formData
        .get("techStack")
        ?.toString()
        .split(",")
        .map((s) => s.trim()),
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/projects");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Showcase Your Project
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Share your hard work with the community and get featured.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Once submitted, your project will be reviewed by an admin before
            appearing in the showcase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title</label>
              <Input name="title" placeholder="Awesome SaaS app" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                placeholder="Briefly describe what your project does and the problems it solves..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Repository</label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    name="githubLink"
                    placeholder="https://github.com/..."
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Live Demo (Optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    name="liveLink"
                    placeholder="https://yourapp.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  name="imageUrl"
                  placeholder="https://imgur.com/yourimage.png"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-zinc-500">
                Provide a direct link to your project's thumbnail image.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tech Stack (comma separated)
              </label>
              <Input
                name="techStack"
                placeholder="Next.js, Tailwind, TypeScript"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2 mt-6"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {loading ? "Submitting..." : "Submit Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

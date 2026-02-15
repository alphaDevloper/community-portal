"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Globe, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectShowcasePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Showcase</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Discover amazing projects built by our community members.
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-4 w-4" />
            Submit Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <Card
            key={project._id}
            className="group overflow-hidden border-zinc-200 bg-white transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
          >
            {project.imageUrl ? (
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ) : (
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
                No preview image
              </div>
            )}
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech: string) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="px-2 py-0 text-[10px] font-normal uppercase tracking-wider"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="gap-3 border-t border-zinc-100 p-4 pt-4 dark:border-zinc-800">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-zinc-600 hover:text-zinc-900"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </a>
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button size="sm" className="w-full gap-2">
                    <Globe className="h-4 w-4" />
                    Live
                  </Button>
                </a>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">
            No projects featured yet. Be the first!
          </p>
        </div>
      )}
    </div>
  );
}

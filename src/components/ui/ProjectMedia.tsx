"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { ProjectArt } from "./ProjectArt";
import { cn } from "@/lib/utils";

/**
 * Renders a project's real cover image (optimized via next/image) when provided,
 * otherwise an original procedural concept illustration. If a preview video is
 * configured, it plays muted while `playing` is true (e.g. on card hover).
 */
export function ProjectMedia({
  project,
  sizes,
  priority,
  playing = false,
  className,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  playing?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [playing]);

  return (
    <div className={cn("absolute inset-0", className)}>
      {project.cover ? (
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-center"
        />
      ) : (
        <ProjectArt
          variant={project.art}
          tint={project.tint}
          uid={`art-${project.slug}`}
          className="h-full w-full"
        />
      )}
      {project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}

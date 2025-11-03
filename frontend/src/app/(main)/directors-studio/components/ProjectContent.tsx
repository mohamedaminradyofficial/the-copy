"use client";

import ProjectStats from "./ProjectStats";
import { ProjectTabs } from "./ProjectTabs";
import {
  calculateProjectStats,
  type CharacterTrackerProps,
  type SceneCardProps,
} from "../helpers/projectSummary";

interface ProjectContentProps {
  scenes: SceneCardProps[];
  characters: CharacterTrackerProps["characters"];
}

export function ProjectContent({ scenes, characters }: ProjectContentProps) {
  const stats = calculateProjectStats(scenes, characters);

  return (
    <>
      <ProjectStats {...stats} />
      <ProjectTabs scenes={scenes} characters={characters} />
    </>
  );
}

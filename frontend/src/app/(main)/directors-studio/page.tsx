"use client";

import { PageLayout } from "./components/PageLayout";
import { LoadingSection } from "./components/LoadingSection";
import { NoProjectSection } from "./components/NoProjectSection";
import { ProjectContent } from "./components/ProjectContent";
import { useProjectScenes, useProjectCharacters } from "./hooks/useProject";
import { getCurrentProject } from "./lib/projectStore";
import {
  hasActiveProject,
  prepareCharacterList,
  type CharacterTrackerProps,
  type ProjectCharacterInput,
  type SceneCardProps,
} from "./helpers/projectSummary";

export default function DirectorsStudioPage() {
  const currentProjectId = getCurrentProject();
  const activeProjectKey = currentProjectId ?? undefined;
  const { data: scenes, isLoading: scenesLoading } = useProjectScenes(activeProjectKey);
  const { data: characters, isLoading: charactersLoading } = useProjectCharacters(activeProjectKey);

  const isLoading = [scenesLoading, charactersLoading].some(Boolean);
  const scenesList: SceneCardProps[] = scenes ?? [];
  const charactersList: CharacterTrackerProps["characters"] = prepareCharacterList(
    characters as ProjectCharacterInput | undefined,
  );

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSection />
      </PageLayout>
    );
  }

  if (!hasActiveProject(currentProjectId, scenesList)) {
    return (
      <PageLayout>
        <NoProjectSection />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ProjectContent scenes={scenesList} characters={charactersList} />
    </PageLayout>
  );
}

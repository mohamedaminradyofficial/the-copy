"use client";

import DashboardHero from "./components/DashboardHero";
import ProjectStats from "./components/ProjectStats";
import SceneCard from "./components/SceneCard";
import CharacterTracker from "./components/CharacterTracker";
import ScriptUploadZone from "./components/ScriptUploadZone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectScenes, useProjectCharacters } from "./hooks/useProject";
import { getCurrentProject } from "./lib/projectStore";

export default function DirectorsStudioPage() {
  const currentProjectId = getCurrentProject();
  const { data: scenes, isLoading: scenesLoading } = useProjectScenes(currentProjectId || undefined);
  const { data: characters, isLoading: charactersLoading } = useProjectCharacters(currentProjectId || undefined);

  const hasProject = !!currentProjectId && !!scenes && scenes.length > 0;

  const completedScenes = scenes?.filter(s => s.status === "completed").length || 0;
  const totalShots = scenes?.reduce((sum, s) => sum + s.shotCount, 0) || 0;

  return (
    <div className="space-y-8">
      <DashboardHero />

      {scenesLoading || charactersLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : hasProject ? (
        <>
          <ProjectStats
            totalScenes={scenes?.length || 0}
            totalCharacters={characters?.length || 0}
            totalShots={totalShots}
            completedScenes={completedScenes}
          />

          <Tabs defaultValue="scenes" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mr-auto">
              <TabsTrigger value="scenes" data-testid="tab-scenes">
                المشاهد
              </TabsTrigger>
              <TabsTrigger value="characters" data-testid="tab-characters">
                الشخصيات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scenes" className="space-y-4 mt-6">
              {scenes && scenes.length > 0 ? (
                scenes.map((scene) => (
                  <SceneCard
                    key={scene.id}
                    {...scene}
                    status={scene.status as "planned" | "in-progress" | "completed"}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  لا توجد مشاهد بعد. قم بتحميل سيناريو للبدء.
                </p>
              )}
            </TabsContent>

            <TabsContent value="characters" className="mt-6">
              {characters && characters.length > 0 ? (
                <CharacterTracker
                  characters={characters.map(c => ({
                    ...c,
                    consistencyStatus: c.consistencyStatus as "good" | "warning" | "issue",
                    lastSeen: c.lastSeen || "غير محدد"
                  }))}
                />
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  لا توجد شخصيات بعد.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="max-w-4xl mx-auto">
          <ScriptUploadZone />
        </div>
      )}
    </div>
  );
}

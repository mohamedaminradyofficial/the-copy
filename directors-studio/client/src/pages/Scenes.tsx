import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Search, Filter, Plus } from "lucide-react";
import { useProjectScenes } from "@/hooks/useProject";
import { getCurrentProject } from "@/lib/projectStore";
import { Skeleton } from "@/components/ui/skeleton";
import SceneCard from "@/components/SceneCard";
import SceneFormDialog from "@/components/SceneFormDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Scenes() {
  const currentProjectId = getCurrentProject();
  const { data: scenes, isLoading } = useProjectScenes(currentProjectId || undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!currentProjectId || !scenes || scenes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-right">
          <h1 className="text-4xl font-bold font-serif mb-2">المشاهد</h1>
          <p className="text-muted-foreground text-lg">
            لا توجد مشاهد بعد. قم بتحميل سيناريو للبدء.
          </p>
        </div>
        
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="p-6 rounded-full bg-primary/10">
              <Layers className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">لا توجد مشاهد</h3>
              <p className="text-muted-foreground">
                ابدأ بتحميل سيناريو لاستخراج المشاهد تلقائياً
              </p>
            </div>
            <Button asChild data-testid="button-upload-script">
              <a href="/">
                <Plus className="w-4 h-4 ml-2" />
                تحميل سيناريو جديد
              </a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const filteredScenes = scenes.filter(scene => {
    const matchesSearch = scene.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scene.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || scene.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const maxSceneNumber = scenes && scenes.length > 0 
    ? Math.max(...scenes.map(s => s.sceneNumber))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-row-reverse gap-4 flex-wrap">
        <div className="text-right">
          <h1 className="text-4xl font-bold font-serif mb-2">المشاهد</h1>
          <p className="text-muted-foreground text-lg">
            إجمالي {scenes.length} مشهد
          </p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-scene">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مشهد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48" data-testid="select-status-filter">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="planned">مخطط</SelectItem>
                <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن مشهد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                dir="rtl"
                data-testid="input-search-scenes"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {filteredScenes.length > 0 ? (
          filteredScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              id={scene.id}
              sceneNumber={scene.sceneNumber}
              title={scene.title}
              location={scene.location}
              timeOfDay={scene.timeOfDay}
              characters={scene.characters}
              shotCount={scene.shotCount}
              status={scene.status as "planned" | "in-progress" | "completed"}
              description={scene.description}
              onEdit={() => {
                setEditingScene(scene);
                setIsDialogOpen(true);
              }}
            />
          ))
        ) : (
          <Card className="p-12">
            <p className="text-center text-muted-foreground">
              لا توجد نتائج مطابقة للبحث
            </p>
          </Card>
        )}
      </div>
      
      <SceneFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingScene(null);
        }}
        projectId={currentProjectId || ""}
        scene={editingScene}
        maxSceneNumber={maxSceneNumber}
      />
    </div>
  );
}

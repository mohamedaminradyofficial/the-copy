import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Plus } from "lucide-react";
import { useProjectScenes, useSceneShots, useCreateShot, useUpdateShot, useDeleteShot } from "@/hooks/useProject";
import { getCurrentProject } from "@/lib/projectStore";
import { Skeleton } from "@/components/ui/skeleton";
import ShotPlanningCard from "@/components/ShotPlanningCard";
import type { Shot } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Shots() {
  const currentProjectId = getCurrentProject();
  const { data: scenes, isLoading } = useProjectScenes(currentProjectId || undefined);
  const [selectedSceneId, setSelectedSceneId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shotToDelete, setShotToDelete] = useState<Shot | null>(null);
  const { toast } = useToast();
  
  const actualSceneId = selectedSceneId || scenes?.[0]?.id;
  const { data: shots, isLoading: shotsLoading } = useSceneShots(actualSceneId);
  const createShotMutation = useCreateShot();
  const updateShotMutation = useUpdateShot();
  const deleteShotMutation = useDeleteShot();

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
          <h1 className="text-4xl font-bold font-serif mb-2">تخطيط اللقطات</h1>
          <p className="text-muted-foreground text-lg">
            لا توجد مشاهد بعد. قم بتحميل سيناريو للبدء.
          </p>
        </div>
        
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="p-6 rounded-full bg-primary/10">
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">لا توجد لقطات</h3>
              <p className="text-muted-foreground">
                ابدأ بتحميل سيناريو وإنشاء مشاهد لتخطيط اللقطات
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

  const selectedScene = selectedSceneId 
    ? scenes.find(s => s.id === selectedSceneId)
    : scenes[0];

  const handleAddShot = async () => {
    if (!selectedScene) return;
    
    try {
      await createShotMutation.mutateAsync({
        sceneId: selectedScene.id,
        shotNumber: (shots?.length || 0) + 1,
        shotType: "medium",
        cameraAngle: "eye-level",
        cameraMovement: "static",
        lighting: "natural",
        aiSuggestion: null,
      });
    } catch (error) {
      console.error("Failed to create shot:", error);
    }
  };

  const handleSaveShot = async (shotId: string, shotData: Partial<Shot>) => {
    try {
      await updateShotMutation.mutateAsync({
        id: shotId,
        data: shotData,
      });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ اللقطة بنجاح",
      });
    } catch (error) {
      console.error("Failed to update shot:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل حفظ اللقطة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShot = async () => {
    if (!shotToDelete) return;

    try {
      await deleteShotMutation.mutateAsync(shotToDelete.id);
      toast({
        title: "تم الحذف",
        description: "تم حذف اللقطة بنجاح",
      });
      setDeleteDialogOpen(false);
      setShotToDelete(null);
    } catch (error) {
      console.error("Failed to delete shot:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل حذف اللقطة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-row-reverse flex-wrap gap-4">
        <div className="text-right">
          <h1 className="text-4xl font-bold font-serif mb-2">تخطيط اللقطات</h1>
          <p className="text-muted-foreground text-lg">
            خطط لقطاتك السينمائية بمساعدة الذكاء الاصطناعي
          </p>
        </div>

        <Select 
          value={selectedSceneId || scenes[0]?.id} 
          onValueChange={setSelectedSceneId}
        >
          <SelectTrigger className="w-64" data-testid="select-scene">
            <SelectValue placeholder="اختر مشهداً" />
          </SelectTrigger>
          <SelectContent>
            {scenes.map((scene) => (
              <SelectItem key={scene.id} value={scene.id}>
                المشهد {scene.sceneNumber}: {scene.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedScene && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-right">
                المشهد {selectedScene.sceneNumber}: {selectedScene.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 text-right">
                <div>
                  <p className="text-sm text-muted-foreground">الموقع</p>
                  <p className="font-medium">{selectedScene.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">وقت اليوم</p>
                  <p className="font-medium">{selectedScene.timeOfDay}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">الوصف</p>
                  <p className="font-medium">{selectedScene.description || "لا يوجد وصف"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={handleAddShot} 
                disabled={createShotMutation.isPending}
                data-testid="button-add-shot"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة لقطة جديدة
              </Button>
              <h2 className="text-2xl font-bold">
                اللقطات المخططة ({shots?.length || 0})
              </h2>
            </div>

            {shotsLoading ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
              </div>
            ) : shots && shots.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {shots.map((shot) => (
                  <ShotPlanningCard 
                    key={shot.id}
                    shot={shot}
                    shotNumber={shot.shotNumber} 
                    sceneNumber={selectedScene.sceneNumber}
                    sceneDescription={selectedScene.description || selectedScene.title}
                    onSave={(data) => handleSaveShot(shot.id, data)}
                    onDelete={() => {
                      setShotToDelete(shot);
                      setDeleteDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12">
                <p className="text-center text-muted-foreground">
                  لا توجد لقطات بعد. انقر على "إضافة لقطة جديدة" للبدء.
                </p>
              </Card>
            )}
          </div>
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف اللقطة {shotToDelete?.shotNumber}؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={handleDeleteShot}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete-shot"
            >
              حذف
            </AlertDialogAction>
            <AlertDialogCancel data-testid="button-cancel-delete-shot">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

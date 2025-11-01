import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, Upload, Download } from "lucide-react";
import { useProject, useUpdateProject } from "@/hooks/useProject";
import { getCurrentProject } from "@/lib/projectStore";
import { Skeleton } from "@/components/ui/skeleton";
import ScriptUploadZone from "@/components/ScriptUploadZone";
import { useToast } from "@/hooks/use-toast";

export default function Script() {
  const currentProjectId = getCurrentProject();
  const { data: project, isLoading } = useProject(currentProjectId || undefined);
  const updateProject = useUpdateProject();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [scriptContent, setScriptContent] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!currentProjectId || !project) {
    return (
      <div className="space-y-6">
        <div className="text-right">
          <h1 className="text-4xl font-bold font-serif mb-2">السيناريو</h1>
          <p className="text-muted-foreground text-lg">
            ابدأ بتحميل سيناريو جديد
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <ScriptUploadZone />
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!currentProjectId) return;
    
    try {
      await updateProject.mutateAsync({
        id: currentProjectId,
        data: { scriptContent }
      });
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التعديلات على السيناريو بنجاح",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل حفظ السيناريو",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!project.scriptContent) return;
    
    const blob = new Blob([project.scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-row-reverse">
        <div className="text-right">
          <h1 className="text-4xl font-bold font-serif mb-2">السيناريو</h1>
          <p className="text-muted-foreground text-lg">
            {project.title}
          </p>
        </div>
        
        <div className="flex gap-2">
          {project.scriptContent && (
            <>
              <Button 
                variant="outline" 
                onClick={handleDownload}
                data-testid="button-download-script"
              >
                <Download className="w-4 h-4 ml-2" />
                تحميل
              </Button>
              
              {isEditing ? (
                <Button 
                  onClick={handleSave} 
                  disabled={updateProject.isPending}
                  data-testid="button-save-script"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {updateProject.isPending ? "جاري الحفظ..." : "حفظ"}
                </Button>
              ) : (
                <Button onClick={() => {
                  setIsEditing(true);
                  setScriptContent(project.scriptContent || "");
                }} data-testid="button-edit-script">
                  <FileText className="w-4 h-4 ml-2" />
                  تحرير
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {project.scriptContent ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">نص السيناريو</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="min-h-[600px] font-mono text-sm"
                dir="rtl"
                data-testid="textarea-script-content"
              />
            ) : (
              <div 
                className="whitespace-pre-wrap font-mono text-sm min-h-[600px] p-4 rounded-md bg-muted"
                dir="rtl"
                data-testid="text-script-content"
              >
                {project.scriptContent}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto">
          <ScriptUploadZone />
        </div>
      )}
    </div>
  );
}

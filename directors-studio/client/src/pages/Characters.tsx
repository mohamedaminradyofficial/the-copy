import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, CheckCircle2, AlertCircle, Edit2, Trash2, MoreVertical } from "lucide-react";
import { useProjectCharacters, useDeleteCharacter } from "@/hooks/useProject";
import { getCurrentProject } from "@/lib/projectStore";
import { Skeleton } from "@/components/ui/skeleton";
import CharacterFormDialog from "@/components/CharacterFormDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function Characters() {
  const currentProjectId = getCurrentProject();
  const { data: characters, isLoading } = useProjectCharacters(currentProjectId || undefined);
  const deleteCharacter = useDeleteCharacter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!currentProjectId || !characters || characters.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-right">
          <h1 className="text-4xl font-bold font-serif mb-2">الشخصيات</h1>
          <p className="text-muted-foreground text-lg">
            لا توجد شخصيات بعد. قم بتحميل سيناريو للبدء.
          </p>
        </div>
        
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="p-6 rounded-full bg-primary/10">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">لا توجد شخصيات</h3>
              <p className="text-muted-foreground">
                ابدأ بتحميل سيناريو لاستخراج الشخصيات تلقائياً
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

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case "issue":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "good":
        return "متسق";
      case "warning":
        return "تحذير";
      case "issue":
        return "مشكلة";
      default:
        return "متسق";
    }
  };

  const handleDelete = async () => {
    if (!characterToDelete) return;

    try {
      await deleteCharacter.mutateAsync(characterToDelete.id);
      toast({
        title: "تم الحذف",
        description: "تم حذف الشخصية بنجاح",
      });
      setDeleteDialogOpen(false);
      setCharacterToDelete(null);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل حذف الشخصية",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-row-reverse gap-4 flex-wrap">
        <div className="text-right">
          <h1 className="text-4xl font-bold font-serif mb-2">الشخصيات</h1>
          <p className="text-muted-foreground text-lg">
            إجمالي {characters.length} شخصية
          </p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-character">
          <Plus className="w-4 h-4 ml-2" />
          إضافة شخصية
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن شخصية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              dir="rtl"
              data-testid="input-search-characters"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map((character) => (
            <Card key={character.id} className="hover-elevate active-elevate-2" data-testid={`card-character-${character.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-xl font-semibold">
                      {character.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-right space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" data-testid="button-character-menu">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingCharacter(character);
                              setIsDialogOpen(true);
                            }}
                            data-testid="button-edit-character"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCharacterToDelete(character);
                              setDeleteDialogOpen(true);
                            }}
                            data-testid="button-delete-character"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <div>
                        <h3 className="text-lg font-semibold mb-1">{character.name}</h3>
                        <div className="flex items-center justify-end gap-2">
                          {getStatusIcon(character.consistencyStatus)}
                          <Badge variant="secondary" className="text-xs">
                            {getStatusLabel(character.consistencyStatus)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{character.appearances} ظهور</p>
                      {character.lastSeen && (
                        <p className="text-xs">آخر ظهور: {character.lastSeen}</p>
                      )}
                    </div>

                    {character.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {character.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full p-12">
            <p className="text-center text-muted-foreground">
              لا توجد نتائج مطابقة للبحث
            </p>
          </Card>
        )}
      </div>
      
      <CharacterFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingCharacter(null);
        }}
        projectId={currentProjectId || ""}
        character={editingCharacter}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف "{characterToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete-character"
            >
              حذف
            </AlertDialogAction>
            <AlertDialogCancel data-testid="button-cancel-delete-character">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

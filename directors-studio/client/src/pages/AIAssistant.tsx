import AIChatPanel from "@/components/AIChatPanel";
import ShotPlanningCard from "@/components/ShotPlanningCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIAssistant() {
  return (
    <div className="space-y-6">
      <div className="text-right">
        <h1 className="text-4xl font-bold font-serif mb-2">المساعد الذكي</h1>
        <p className="text-muted-foreground text-lg">
          احصل على مساعدة مدعومة بالذكاء الاصطناعي في جميع جوانب الإنتاج
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AIChatPanel />
        
        <div className="space-y-6">
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggestions" data-testid="tab-suggestions">
                اقتراحات ذكية
              </TabsTrigger>
              <TabsTrigger value="planning" data-testid="tab-planning">
                تخطيط اللقطات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-4 mt-6">
              <div className="p-6 rounded-md border bg-card space-y-4">
                <h3 className="font-semibold text-lg text-right">اقتراحات لتحسين المشهد الحالي</h3>
                <ul className="space-y-3 text-right">
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-primary">•</span>
                    <p className="text-sm text-muted-foreground">
                      استخدم إضاءة منخفضة لزيادة التوتر في مشهد المواجهة
                    </p>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-primary">•</span>
                    <p className="text-sm text-muted-foreground">
                      أضف لقطة قريبة على وجه الشخصية الرئيسية لإظهار المشاعر
                    </p>
                  </li>
                  <li className="flex items-start gap-3 flex-row-reverse">
                    <span className="text-primary">•</span>
                    <p className="text-sm text-muted-foreground">
                      فكر في استخدام كاميرا محمولة لزيادة الديناميكية
                    </p>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="planning" className="space-y-4 mt-6">
              <ShotPlanningCard shotNumber={1} sceneNumber={3} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
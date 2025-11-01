import SceneCard from '../SceneCard';

export default function SceneCardExample() {
  return (
    <div className="space-y-4 p-6">
      <SceneCard
        sceneNumber={1}
        title="اللقاء الأول"
        location="مقهى في وسط المدينة"
        timeOfDay="نهار - ظهيرة"
        characters={["أحمد", "سارة", "النادل"]}
        shotCount={5}
        status="completed"
      />
      <SceneCard
        sceneNumber={2}
        title="المطاردة"
        location="شوارع المدينة القديمة"
        timeOfDay="ليل"
        characters={["أحمد", "الشرير"]}
        shotCount={12}
        status="in-progress"
      />
      <SceneCard
        sceneNumber={3}
        title="الكشف الكبير"
        location="مكتب المحقق"
        timeOfDay="نهار - صباح"
        characters={["المحقق", "أحمد", "سارة"]}
        status="planned"
      />
    </div>
  );
}
import ShotPlanningCard from '../ShotPlanningCard';

export default function ShotPlanningCardExample() {
  return (
    <div className="space-y-4 p-6">
      <ShotPlanningCard shotNumber={1} sceneNumber={3} />
      <ShotPlanningCard shotNumber={2} sceneNumber={3} />
    </div>
  );
}
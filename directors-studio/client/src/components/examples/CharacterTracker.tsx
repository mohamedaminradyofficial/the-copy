import CharacterTracker from '../CharacterTracker';

export default function CharacterTrackerExample() {
  const mockCharacters = [
    {
      id: "1",
      name: "أحمد المحقق",
      appearances: 15,
      consistencyStatus: "good" as const,
      lastSeen: "المشهد 12"
    },
    {
      id: "2",
      name: "سارة الصحفية",
      appearances: 8,
      consistencyStatus: "warning" as const,
      lastSeen: "المشهد 9"
    },
    {
      id: "3",
      name: "الشرير الغامض",
      appearances: 6,
      consistencyStatus: "good" as const,
      lastSeen: "المشهد 11"
    },
    {
      id: "4",
      name: "المساعد علي",
      appearances: 12,
      consistencyStatus: "issue" as const,
      lastSeen: "المشهد 10"
    }
  ];

  return <CharacterTracker characters={mockCharacters} />;
}
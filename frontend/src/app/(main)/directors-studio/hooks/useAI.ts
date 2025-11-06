import { useMutation } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useChatWithAI() {
  return useMutation({
    mutationFn: ({
      message,
      history,
      onChunk
    }: {
      message: string;
      history: Array<{ role: string; content: string }>;
      onChunk?: (chunk: string) => void;
    }) =>
      api.chatWithAI(message, history, onChunk),
  });
}

export function useGetShotSuggestion() {
  return useMutation({
    mutationFn: ({ sceneDescription, shotType, cameraAngle }: { sceneDescription: string; shotType: string; cameraAngle: string }) =>
      api.getShotSuggestion(sceneDescription, shotType, cameraAngle),
  });
}

import { useMutation } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useChatWithAI() {
  return useMutation({
    mutationFn: ({ message, history }: { message: string; history: Array<{ role: string; content: string }> }) =>
      api.chatWithAI(message, history),
  });
}

export function useGetShotSuggestion() {
  return useMutation({
    mutationFn: ({ sceneDescription, shotType, cameraAngle }: { sceneDescription: string; shotType: string; cameraAngle: string }) =>
      api.getShotSuggestion(sceneDescription, shotType, cameraAngle),
  });
}

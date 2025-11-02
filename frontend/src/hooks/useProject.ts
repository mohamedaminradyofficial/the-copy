import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import * as api from "@/lib/api";

export function useProjects() {
  return useQuery({
    queryKey: ["/api/projects"],
    queryFn: api.getProjects,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", id],
    queryFn: () => api.getProject(id!),
    enabled: !!id,
  });
}

export function useProjectScenes(projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "scenes"],
    queryFn: () => api.getProjectScenes(projectId!),
    enabled: !!projectId,
  });
}

export function useProjectCharacters(projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "characters"],
    queryFn: () => api.getProjectCharacters(projectId!),
    enabled: !!projectId,
  });
}

export function useCreateCharacter() {
  return useMutation({
    mutationFn: (character: any) => api.createCharacter(character),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.projectId, "characters"] });
    },
  });
}

export function useUpdateCharacter() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCharacter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/projects" && query.queryKey[2] === "characters"
      });
    },
  });
}

export function useDeleteCharacter() {
  return useMutation({
    mutationFn: (id: string) => api.deleteCharacter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/projects" && query.queryKey[2] === "characters"
      });
    },
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: (title: string) => api.createProject(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.id] });
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useAnalyzeScript() {
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      api.analyzeScript(projectId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.projectId, "scenes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.projectId, "characters"] });
    },
  });
}

export function useCreateScene() {
  return useMutation({
    mutationFn: (scene: any) => api.createScene(scene),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", variables.projectId, "scenes"] });
    },
  });
}

export function useUpdateScene() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateScene(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/projects" && query.queryKey[2] === "scenes"
      });
    },
  });
}

export function useDeleteScene() {
  return useMutation({
    mutationFn: (id: string) => api.deleteScene(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/projects" && query.queryKey[2] === "scenes"
      });
    },
  });
}

export function useSceneShots(sceneId: string | undefined) {
  return useQuery({
    queryKey: ["/api/scenes", sceneId, "shots"],
    queryFn: () => api.getSceneShots(sceneId!),
    enabled: !!sceneId,
  });
}

export function useCreateShot() {
  return useMutation({
    mutationFn: (shot: any) => api.createShot(shot),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/scenes", variables.sceneId, "shots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useUpdateShot() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateShot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/scenes" && query.queryKey[2] === "shots"
      });
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/projects" && query.queryKey[2] === "scenes"
      });
    },
  });
}

export function useDeleteShot() {
  return useMutation({
    mutationFn: (id: string) => api.deleteShot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/scenes" && query.queryKey[2] === "shots"
      });
      queryClient.invalidateQueries({ predicate: (query) => 
        query.queryKey[0] === "/api/projects" && query.queryKey[2] === "scenes"
      });
    },
  });
}

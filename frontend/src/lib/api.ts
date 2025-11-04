import { type Project, type Scene, type Character, type Shot } from "../shared/schema";

export async function createProject(title: string): Promise<Project> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, scriptContent: null }),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
}

export async function analyzeScript(projectId: string, file: File): Promise<any> {
  const formData = new FormData();
  formData.append("script", file);
  
  const response = await fetch(`/api/projects/${projectId}/analyze`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to analyze script");
  return response.json();
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects");
  if (!response.ok) throw new Error("Failed to get projects");
  return response.json();
}

export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) throw new Error("Failed to get project");
  return response.json();
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete project");
}

export async function getProjectScenes(projectId: string): Promise<Scene[]> {
  const response = await fetch(`/api/projects/${projectId}/scenes`);
  if (!response.ok) throw new Error("Failed to get scenes");
  return response.json();
}

export async function getProjectCharacters(projectId: string): Promise<Character[]> {
  const response = await fetch(`/api/projects/${projectId}/characters`);
  if (!response.ok) throw new Error("Failed to get characters");
  return response.json();
}

export async function createCharacter(character: Omit<Character, "id">): Promise<Character> {
  const response = await fetch("/api/characters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character),
  });
  if (!response.ok) throw new Error("Failed to create character");
  return response.json();
}

export async function updateCharacter(id: string, data: Partial<Character>): Promise<Character> {
  const response = await fetch(`/api/characters/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update character");
  return response.json();
}

export async function deleteCharacter(id: string): Promise<void> {
  const response = await fetch(`/api/characters/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete character");
}

export async function createScene(scene: Omit<Scene, "id">): Promise<Scene> {
  const response = await fetch("/api/scenes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scene),
  });
  if (!response.ok) throw new Error("Failed to create scene");
  return response.json();
}

export async function updateScene(id: string, data: Partial<Scene>): Promise<Scene> {
  const response = await fetch(`/api/scenes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update scene");
  return response.json();
}

export async function deleteScene(id: string): Promise<void> {
  const response = await fetch(`/api/scenes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete scene");
}

export async function getSceneShots(sceneId: string): Promise<Shot[]> {
  const response = await fetch(`/api/scenes/${sceneId}/shots`);
  if (!response.ok) throw new Error("Failed to get shots");
  return response.json();
}

export async function createShot(shot: Omit<Shot, "id">): Promise<Shot> {
  const response = await fetch("/api/shots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shot),
  });
  if (!response.ok) throw new Error("Failed to create shot");
  return response.json();
}

export async function updateShot(id: string, data: Partial<Shot>): Promise<Shot> {
  const response = await fetch(`/api/shots/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update shot");
  return response.json();
}

export async function deleteShot(id: string): Promise<void> {
  const response = await fetch(`/api/shots/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete shot");
}

export async function getShotSuggestion(
  sceneDescription: string,
  shotType: string,
  cameraAngle: string
): Promise<{ suggestion: string; reasoning: string }> {
  const response = await fetch("/api/shots/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sceneDescription, shotType, cameraAngle }),
  });
  if (!response.ok) throw new Error("Failed to get suggestion");
  return response.json();
}

export async function chatWithAI(
  message: string,
  history: Array<{ role: string; content: string }>
): Promise<{ response: string }> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!response.ok) throw new Error("Failed to chat with AI");
  return response.json();
}

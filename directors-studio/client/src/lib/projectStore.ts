// Simple in-memory store for current project ID
// This could be replaced with localStorage or URL params in a full implementation

let currentProjectId: string | null = null;

export function setCurrentProject(id: string) {
  currentProjectId = id;
  if (typeof window !== "undefined") {
    localStorage.setItem("currentProjectId", id);
  }
}

export function getCurrentProject(): string | null {
  if (currentProjectId) return currentProjectId;
  
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentProjectId");
    if (stored) {
      currentProjectId = stored;
      return stored;
    }
  }
  
  return null;
}

export function clearCurrentProject() {
  currentProjectId = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentProjectId");
  }
}

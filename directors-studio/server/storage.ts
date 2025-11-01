import { 
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type Scene,
  type InsertScene,
  type Character,
  type InsertCharacter,
  type Shot,
  type InsertShot
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProject(id: string): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  getScene(id: string): Promise<Scene | undefined>;
  getScenesByProject(projectId: string): Promise<Scene[]>;
  createScene(scene: InsertScene): Promise<Scene>;
  updateScene(id: string, scene: Partial<InsertScene>): Promise<Scene | undefined>;
  deleteScene(id: string): Promise<boolean>;
  
  getCharacter(id: string): Promise<Character | undefined>;
  getCharactersByProject(projectId: string): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: string): Promise<boolean>;
  
  getShot(id: string): Promise<Shot | undefined>;
  getShotsByScene(sceneId: string): Promise<Shot[]>;
  createShot(shot: InsertShot): Promise<Shot>;
  updateShot(id: string, shot: Partial<InsertShot>): Promise<Shot | undefined>;
  deleteShot(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private scenes: Map<string, Scene>;
  private characters: Map<string, Character>;
  private shots: Map<string, Shot>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.scenes = new Map();
    this.characters = new Map();
    this.shots = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      title: insertProject.title,
      scriptContent: insertProject.scriptContent || null,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, update: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated: Project = { 
      ...project, 
      ...update,
      updatedAt: new Date()
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getScene(id: string): Promise<Scene | undefined> {
    return this.scenes.get(id);
  }

  async getScenesByProject(projectId: string): Promise<Scene[]> {
    return Array.from(this.scenes.values()).filter(
      (scene) => scene.projectId === projectId
    );
  }

  async createScene(insertScene: InsertScene): Promise<Scene> {
    const id = randomUUID();
    const scene: Scene = { 
      ...insertScene,
      id,
      description: insertScene.description || null,
      shotCount: insertScene.shotCount || 0,
      status: insertScene.status || "planned"
    };
    this.scenes.set(id, scene);
    return scene;
  }

  async updateScene(id: string, update: Partial<InsertScene>): Promise<Scene | undefined> {
    const scene = this.scenes.get(id);
    if (!scene) return undefined;
    
    const updated: Scene = { ...scene, ...update };
    this.scenes.set(id, updated);
    return updated;
  }

  async deleteScene(id: string): Promise<boolean> {
    return this.scenes.delete(id);
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getCharactersByProject(projectId: string): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(
      (character) => character.projectId === projectId
    );
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = randomUUID();
    const character: Character = { 
      ...insertCharacter,
      id,
      appearances: insertCharacter.appearances || 0,
      consistencyStatus: insertCharacter.consistencyStatus || "good",
      lastSeen: insertCharacter.lastSeen || null,
      notes: insertCharacter.notes || null
    };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: string, update: Partial<InsertCharacter>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updated: Character = { ...character, ...update };
    this.characters.set(id, updated);
    return updated;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    return this.characters.delete(id);
  }

  async getShot(id: string): Promise<Shot | undefined> {
    return this.shots.get(id);
  }

  async getShotsByScene(sceneId: string): Promise<Shot[]> {
    return Array.from(this.shots.values()).filter(
      (shot) => shot.sceneId === sceneId
    );
  }

  async createShot(insertShot: InsertShot): Promise<Shot> {
    const id = randomUUID();
    const shot: Shot = { 
      ...insertShot,
      id,
      aiSuggestion: insertShot.aiSuggestion || null
    };
    this.shots.set(id, shot);
    
    const scene = this.scenes.get(insertShot.sceneId);
    if (scene) {
      scene.shotCount = (scene.shotCount || 0) + 1;
      this.scenes.set(scene.id, scene);
    }
    
    return shot;
  }

  async updateShot(id: string, update: Partial<InsertShot>): Promise<Shot | undefined> {
    const shot = this.shots.get(id);
    if (!shot) return undefined;
    
    const updated: Shot = { ...shot, ...update };
    this.shots.set(id, updated);
    return updated;
  }

  async deleteShot(id: string): Promise<boolean> {
    const shot = this.shots.get(id);
    const deleted = this.shots.delete(id);
    
    if (deleted && shot) {
      const scene = this.scenes.get(shot.sceneId);
      if (scene && scene.shotCount > 0) {
        scene.shotCount = scene.shotCount - 1;
        this.scenes.set(scene.id, scene);
      }
    }
    
    return deleted;
  }
}

export const storage = new MemStorage();

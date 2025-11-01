import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertSceneSchema, insertCharacterSchema, insertShotSchema } from "@shared/schema";
import { analyzeScript, getShotSuggestions, chatWithAssistant } from "./gemini";
import multer from "multer";
import { readFileSync } from "fs";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.post("/api/projects/:id/analyze", upload.single("script"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const scriptText = readFileSync(req.file.path, "utf-8");
      
      const analysis = await analyzeScript(scriptText);
      
      await storage.updateProject(req.params.id, {
        scriptContent: scriptText
      });

      for (const sceneData of analysis.scenes) {
        await storage.createScene({
          projectId: req.params.id,
          sceneNumber: sceneData.sceneNumber,
          title: sceneData.title,
          location: sceneData.location,
          timeOfDay: sceneData.timeOfDay,
          characters: sceneData.characters,
          description: sceneData.description,
        });
      }

      for (const charData of analysis.characters) {
        await storage.createCharacter({
          projectId: req.params.id,
          name: charData.name,
          notes: charData.description,
        });
      }

      res.json(analysis);
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze script" });
    }
  });

  app.get("/api/projects/:id/scenes", async (req, res) => {
    try {
      const scenes = await storage.getScenesByProject(req.params.id);
      res.json(scenes);
    } catch (error) {
      res.status(500).json({ error: "Failed to get scenes" });
    }
  });

  app.get("/api/projects/:id/characters", async (req, res) => {
    try {
      const characters = await storage.getCharactersByProject(req.params.id);
      res.json(characters);
    } catch (error) {
      res.status(500).json({ error: "Failed to get characters" });
    }
  });

  app.post("/api/characters", async (req, res) => {
    try {
      const data = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(data);
      res.json(character);
    } catch (error) {
      res.status(400).json({ error: "Invalid character data" });
    }
  });

  app.patch("/api/characters/:id", async (req, res) => {
    try {
      const character = await storage.updateCharacter(req.params.id, req.body);
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ error: "Failed to update character" });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const success = await storage.deleteCharacter(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Character not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete character" });
    }
  });

  app.post("/api/scenes", async (req, res) => {
    try {
      const data = insertSceneSchema.parse(req.body);
      const scene = await storage.createScene(data);
      res.json(scene);
    } catch (error) {
      res.status(400).json({ error: "Invalid scene data" });
    }
  });

  app.patch("/api/scenes/:id", async (req, res) => {
    try {
      const scene = await storage.updateScene(req.params.id, req.body);
      if (!scene) {
        return res.status(404).json({ error: "Scene not found" });
      }
      res.json(scene);
    } catch (error) {
      res.status(500).json({ error: "Failed to update scene" });
    }
  });

  app.delete("/api/scenes/:id", async (req, res) => {
    try {
      const success = await storage.deleteScene(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Scene not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete scene" });
    }
  });

  app.get("/api/scenes/:id/shots", async (req, res) => {
    try {
      const shots = await storage.getShotsByScene(req.params.id);
      res.json(shots);
    } catch (error) {
      res.status(500).json({ error: "Failed to get shots" });
    }
  });

  app.post("/api/shots", async (req, res) => {
    try {
      const data = insertShotSchema.parse(req.body);
      const shot = await storage.createShot(data);
      res.json(shot);
    } catch (error) {
      res.status(400).json({ error: "Invalid shot data" });
    }
  });

  app.patch("/api/shots/:id", async (req, res) => {
    try {
      const shot = await storage.updateShot(req.params.id, req.body);
      if (!shot) {
        return res.status(404).json({ error: "Shot not found" });
      }
      res.json(shot);
    } catch (error) {
      res.status(500).json({ error: "Failed to update shot" });
    }
  });

  app.delete("/api/shots/:id", async (req, res) => {
    try {
      const success = await storage.deleteShot(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Shot not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shot" });
    }
  });

  app.post("/api/shots/suggest", async (req, res) => {
    try {
      const { sceneDescription, shotType, cameraAngle } = req.body;
      const suggestion = await getShotSuggestions(sceneDescription, shotType, cameraAngle);
      res.json(suggestion);
    } catch (error: any) {
      console.error("Suggestion error:", error);
      res.status(500).json({ error: error.message || "Failed to get suggestions" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const response = await chatWithAssistant(message, history || []);
      res.json({ response });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to chat" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

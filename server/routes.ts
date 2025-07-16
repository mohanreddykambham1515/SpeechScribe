import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTranscriptionSessionSchema, insertVoiceCommandSchema } from "@shared/schema";
import { voiceCommandProcessor } from "./voice-command-processor";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all transcription sessions
  app.get("/api/transcriptions", async (req, res) => {
    try {
      const sessions = await storage.getTranscriptionSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transcriptions" });
    }
  });

  // Get a specific transcription session
  app.get("/api/transcriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getTranscriptionSession(id);
      if (!session) {
        return res.status(404).json({ error: "Transcription not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transcription" });
    }
  });

  // Create a new transcription session
  app.post("/api/transcriptions", async (req, res) => {
    try {
      const validatedData = insertTranscriptionSessionSchema.parse(req.body);
      const session = await storage.createTranscriptionSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transcription" });
    }
  });

  // Update a transcription session
  app.put("/api/transcriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTranscriptionSessionSchema.parse(req.body);
      const session = await storage.updateTranscriptionSession(id, validatedData);
      if (!session) {
        return res.status(404).json({ error: "Transcription not found" });
      }
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update transcription" });
    }
  });

  // Delete a transcription session
  app.delete("/api/transcriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTranscriptionSession(id);
      if (!success) {
        return res.status(404).json({ error: "Transcription not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transcription" });
    }
  });

  // Get statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Voice command processing
  app.post("/api/voice-commands", async (req, res) => {
    try {
      const { command } = req.body;
      
      if (!command || typeof command !== 'string') {
        return res.status(400).json({ error: "Command is required" });
      }

      // Process the command
      const result = voiceCommandProcessor.processCommand(command);
      
      // Log the command to storage
      const commandData = {
        command: command,
        action: result.action || 'unknown',
        target: result.url || command,
        success: result.success,
        userId: null, // For now, no user system
      };

      await storage.createVoiceCommand(commandData);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to process voice command" });
    }
  });

  // Get voice command history
  app.get("/api/voice-commands", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const commands = await storage.getVoiceCommandHistory(limit);
      res.json(commands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch voice command history" });
    }
  });

  // Get supported websites
  app.get("/api/supported-websites", async (req, res) => {
    try {
      const websites = voiceCommandProcessor.getSupportedWebsites();
      res.json(websites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supported websites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTranscriptionSessionSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}

import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const transcriptionSessions = pgTable("transcription_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  text: text("text").notNull(),
  language: text("language").notNull().default("en-US"),
  duration: integer("duration").notNull().default(0), // in seconds
  wordCount: integer("word_count").notNull().default(0),
  charCount: integer("char_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const voiceCommands = pgTable("voice_commands", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  command: text("command").notNull(),
  action: text("action").notNull(), // 'open_website', 'search', etc.
  target: text("target").notNull(), // URL or search term
  success: boolean("success").notNull().default(true),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTranscriptionSessionSchema = createInsertSchema(transcriptionSessions).omit({
  id: true,
  createdAt: true,
});

export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).omit({
  id: true,
  executedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TranscriptionSession = typeof transcriptionSessions.$inferSelect;
export type InsertTranscriptionSession = z.infer<typeof insertTranscriptionSessionSchema>;
export type VoiceCommand = typeof voiceCommands.$inferSelect;
export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;

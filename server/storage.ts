import { users, transcriptionSessions, voiceCommands, type User, type InsertUser, type TranscriptionSession, type InsertTranscriptionSession, type VoiceCommand, type InsertVoiceCommand } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTranscriptionSessions(): Promise<TranscriptionSession[]>;
  getTranscriptionSession(id: number): Promise<TranscriptionSession | undefined>;
  createTranscriptionSession(session: InsertTranscriptionSession): Promise<TranscriptionSession>;
  updateTranscriptionSession(id: number, session: InsertTranscriptionSession): Promise<TranscriptionSession | undefined>;
  deleteTranscriptionSession(id: number): Promise<boolean>;
  getStatistics(): Promise<{
    totalSessions: number;
    totalTime: number;
    wordsTranscribed: number;
    avgWordsPerSession: number;
  }>;
  
  getVoiceCommands(): Promise<VoiceCommand[]>;
  getVoiceCommand(id: number): Promise<VoiceCommand | undefined>;
  createVoiceCommand(command: InsertVoiceCommand): Promise<VoiceCommand>;
  getVoiceCommandHistory(limit?: number): Promise<VoiceCommand[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transcriptionSessions: Map<number, TranscriptionSession>;
  private voiceCommands: Map<number, VoiceCommand>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentCommandId: number;

  constructor() {
    this.users = new Map();
    this.transcriptionSessions = new Map();
    this.voiceCommands = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentCommandId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTranscriptionSessions(): Promise<TranscriptionSession[]> {
    return Array.from(this.transcriptionSessions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTranscriptionSession(id: number): Promise<TranscriptionSession | undefined> {
    return this.transcriptionSessions.get(id);
  }

  async createTranscriptionSession(insertSession: InsertTranscriptionSession): Promise<TranscriptionSession> {
    const id = this.currentSessionId++;
    const session: TranscriptionSession = {
      text: insertSession.text,
      language: insertSession.language || "en-US",
      duration: insertSession.duration || 0,
      wordCount: insertSession.wordCount || 0,
      charCount: insertSession.charCount || 0,
      userId: insertSession.userId || null,
      id,
      createdAt: new Date(),
    };
    this.transcriptionSessions.set(id, session);
    return session;
  }

  async updateTranscriptionSession(id: number, updateData: InsertTranscriptionSession): Promise<TranscriptionSession | undefined> {
    const existing = this.transcriptionSessions.get(id);
    if (!existing) return undefined;

    const updated: TranscriptionSession = {
      ...existing,
      ...updateData,
    };
    this.transcriptionSessions.set(id, updated);
    return updated;
  }

  async deleteTranscriptionSession(id: number): Promise<boolean> {
    return this.transcriptionSessions.delete(id);
  }

  async getStatistics(): Promise<{
    totalSessions: number;
    totalTime: number;
    wordsTranscribed: number;
    avgWordsPerSession: number;
  }> {
    const sessions = Array.from(this.transcriptionSessions.values());
    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
    const wordsTranscribed = sessions.reduce((sum, session) => sum + session.wordCount, 0);
    const avgWordsPerSession = totalSessions > 0 ? Math.round(wordsTranscribed / totalSessions) : 0;

    return {
      totalSessions,
      totalTime,
      wordsTranscribed,
      avgWordsPerSession,
    };
  }

  async getVoiceCommands(): Promise<VoiceCommand[]> {
    return Array.from(this.voiceCommands.values()).sort(
      (a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
    );
  }

  async getVoiceCommand(id: number): Promise<VoiceCommand | undefined> {
    return this.voiceCommands.get(id);
  }

  async createVoiceCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const id = this.currentCommandId++;
    const command: VoiceCommand = {
      command: insertCommand.command,
      action: insertCommand.action,
      target: insertCommand.target,
      success: insertCommand.success ?? true,
      userId: insertCommand.userId || null,
      id,
      executedAt: new Date(),
    };
    this.voiceCommands.set(id, command);
    return command;
  }

  async getVoiceCommandHistory(limit: number = 50): Promise<VoiceCommand[]> {
    const commands = Array.from(this.voiceCommands.values()).sort(
      (a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
    );
    return commands.slice(0, limit);
  }
}

export const storage = new MemStorage();

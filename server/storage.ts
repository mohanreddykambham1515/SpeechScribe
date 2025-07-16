import { users, transcriptionSessions, type User, type InsertUser, type TranscriptionSession, type InsertTranscriptionSession } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transcriptionSessions: Map<number, TranscriptionSession>;
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.transcriptionSessions = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
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
      ...insertSession,
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
}

export const storage = new MemStorage();

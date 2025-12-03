import Dexie, { Table } from "dexie";

// Define your types
export interface Task {
  id?: string;
  title: string;
  energyLevel: "low" | "medium" | "high";
  priority: "none" | "low" | "medium" | "high";
  isFrog: boolean;
  completed: boolean;
  pomodorosCompleted: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface Mood {
  id?: string;
  level: "very-low" | "low" | "medium" | "high" | "very-high";
  note?: string;
  timestamp: Date;
  userId?: string;
}

// Create database class
class FocusPondDB extends Dexie {
  tasks!: Table<Task, string>;
  moods!: Table<Mood, string>;

  constructor() {
    super("FocusPondDB");
    
    // Define schema (version 1)
    this.version(1).stores({
      tasks: "++id, userId, completed, energyLevel, priority, isFrog, dueDate, createdAt",
      moods: "++id, userId, timestamp",
    });
  }
}

// Export database instance
export const db = new FocusPondDB();
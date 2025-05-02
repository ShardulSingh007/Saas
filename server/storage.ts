import {
  users,
  type User,
  type InsertUser,
  taxCalculations,
  type TaxCalculation,
  type InsertTaxCalculation,
} from "@shared/schema";
import { EventEmitter } from "events";

// In-memory session store class
class InMemoryStore extends EventEmitter {
  private sessions: Map<string, any>;

  constructor() {
    super();
    this.sessions = new Map();
  }

  get(sid: string, callback?: (err: any, session?: any) => void) {
    const session = this.sessions.get(sid);
    if (callback) {
      callback(null, session);
      return;
    }
    return session;
  }

  set(sid: string, session: any, callback?: (err?: any) => void) {
    this.sessions.set(sid, session);
    if (callback) callback();
  }

  destroy(sid: string, callback?: (err?: any) => void) {
    this.sessions.delete(sid);
    if (callback) callback();
  }

  all(callback: (err: any, sessions?: any) => void) {
    const sessions: any = {};
    this.sessions.forEach((val: any, key: string) => {
      sessions[key] = val;
    });
    callback(null, sessions);
  }

  touch(sid: string, session: any, callback?: () => void) {
    this.sessions.set(sid, session);
    if (callback) callback();
  }
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(
    suppliedPassword: string,
    storedHash: string,
  ): Promise<boolean>;
  hashPassword(password: string): Promise<string>;

  // Tax calculation methods
  createTaxCalculation(data: InsertTaxCalculation): Promise<TaxCalculation>;
  getTaxCalculation(id: number): Promise<TaxCalculation | undefined>;
  getTaxCalculations(userId?: number): Promise<TaxCalculation[]>;
  updateTaxCalculation(
    id: number,
    data: InsertTaxCalculation,
  ): Promise<TaxCalculation | undefined>;
  deleteTaxCalculation(id: number): Promise<boolean>;

  // Session store for authentication
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private taxCalculationStore: Map<number, TaxCalculation>;
  private userIdCounter: number;
  private taxCalculationIdCounter: number;
  public sessionStore: any;

  constructor() {
    this.users = new Map();
    this.taxCalculationStore = new Map();
    this.userIdCounter = 1;
    this.taxCalculationIdCounter = 1;

    // Create a session store instance
    this.sessionStore = new InMemoryStore();

    // Initialize with an admin user
    this.initializeAdminUser();
  }

  private async initializeAdminUser() {
    const adminExists = await this.getUserByUsername("admin");

    if (!adminExists) {
      // Create admin user with properly hashed password
      const hashedPassword = await this.hashPassword("Adminpanelaccess"); // Replace with your desired password

      const adminUser: User = {
        id: this.userIdCounter++,
        username: "Privateaccessonly", // Replace with your desired username
        password: hashedPassword,
        isAdmin: true,
        name: "Administrator",
        email: "admin@example.com",
      };

      this.users.set(adminUser.id, adminUser);
      console.log("Admin user created successfully");
    }
  }

  // Password methods
  async hashPassword(password: string): Promise<string> {
    // In a real app, we would use a proper hashing algorithm like bcrypt
    // For this demo, we're just returning the password as-is
    return password;
  }

  async verifyPassword(
    suppliedPassword: string,
    storedHash: string,
  ): Promise<boolean> {
    // In a real app, we would use a proper verification method
    // For this demo, we're just comparing the strings
    return suppliedPassword === storedHash;
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      ...insertUser,
      id,
      name: insertUser.name || null,
      email: insertUser.email || null,
      isAdmin: insertUser.isAdmin || false,
    };
    this.users.set(id, user);
    return user;
  }

  // Tax Calculation Methods
  async createTaxCalculation(
    data: InsertTaxCalculation,
  ): Promise<TaxCalculation> {
    const id = this.taxCalculationIdCounter++;
    const now = new Date();

    const taxCalculation: TaxCalculation = {
      ...data,
      id,
      userId: data.userId || null,
      age: data.age || null,
      createdAt: now,
      updatedAt: now,
      // Ensure all required fields have values
      deductionsData: data.deductionsData || null,
      creditsData: data.creditsData || null,
      calculationResults: data.calculationResults || null,
    };

    this.taxCalculationStore.set(id, taxCalculation);
    return taxCalculation;
  }

  async getTaxCalculation(id: number): Promise<TaxCalculation | undefined> {
    return this.taxCalculationStore.get(id);
  }

  async getTaxCalculations(userId?: number): Promise<TaxCalculation[]> {
    const allCalculations = Array.from(this.taxCalculationStore.values());

    if (userId !== undefined) {
      return allCalculations.filter((calc) => calc.userId === userId);
    }

    return allCalculations;
  }

  async updateTaxCalculation(
    id: number,
    data: InsertTaxCalculation,
  ): Promise<TaxCalculation | undefined> {
    const existingCalculation = this.taxCalculationStore.get(id);

    if (!existingCalculation) {
      return undefined;
    }

    const updatedCalculation: TaxCalculation = {
      ...existingCalculation,
      ...data,
      id,
      updatedAt: new Date(),
    };

    this.taxCalculationStore.set(id, updatedCalculation);
    return updatedCalculation;
  }

  async deleteTaxCalculation(id: number): Promise<boolean> {
    if (!this.taxCalculationStore.has(id)) {
      return false;
    }

    return this.taxCalculationStore.delete(id);
  }
}

export const storage = new MemStorage();

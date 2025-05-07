import { TaxCalculation, insertTaxCalculationSchema } from "@shared/schema";
import { EventEmitter } from "events";
import sqlite3 from "sqlite3";
import { Database, RunResult } from "sqlite3";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

// Import types from shared schema
type SchemaUser = import("@shared/schema").User;
type SchemaInvoice = import("@shared/schema").Invoice;
type SchemaExpense = import("@shared/schema").Expense;
type SchemaActivity = import("@shared/schema").Activity;

// Define additional types
interface Invoice {
  id: number;
  userId: number;
  title: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

interface Expense {
  id: number;
  userId: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

interface Activity {
  id: number;
  userId: number;
  action: string;
  details: string;
  createdAt: string;
}

// In-memory session store class
class InMemoryStore extends EventEmitter {
  private sessions: Map<string, any>;

  constructor() {
    super();
    this.sessions = new Map();
  }

  get(sid: string, callback?: (err: any, session?: any) => void): any {
    const session = this.sessions.get(sid);
    if (callback) {
      callback(null, session);
      return;
    }
    return session;
  }

  set(sid: string, session: any, callback?: (err?: any) => void): void {
    this.sessions.set(sid, session);
    if (callback) callback();
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    this.sessions.delete(sid);
    if (callback) callback();
  }

  all(callback: (err: any, sessions?: any) => void): void {
    const sessions: Record<string, any> = {};
    this.sessions.forEach((val: any, key: string) => {
      sessions[key] = val;
    });
    callback(null, sessions);
  }

  touch(sid: string, session: any, callback?: () => void): void {
    this.sessions.set(sid, session);
    if (callback) callback();
  }
}

interface PaymentReminder {
  id: number;
  userId: number;
  title: string;
  amount: number;
  category: string;
  status: 'upcoming' | 'overdue' | 'paid';
  dueDate: string;
  createdAt: string;
  notificationSettings?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    whatsapp?: boolean;
    timing?: number[];
    sound?: string;
  };
}

// Define our own types based on schema types
interface StorageUser {
  id: number;
  username: string;
  password?: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
}

interface StorageInsertUser {
  username: string;
  password: string;
  name?: string | null;
  email?: string | null;
  isAdmin?: boolean;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
}

interface Storage {
  getUser(id: number): Promise<StorageUser | undefined>;
  getUserByUsername(username: string): Promise<StorageUser | undefined>;
  getUserByEmail(email: string): Promise<StorageUser | undefined>;
  createUser(user: StorageInsertUser): Promise<StorageUser>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(suppliedPassword: string, storedHash: string): Promise<boolean>;
  createTaxCalculation(data: typeof insertTaxCalculationSchema._type): Promise<TaxCalculation>;
  getTaxCalculation(id: number): Promise<TaxCalculation | undefined>;
  getTaxCalculations(userId?: number): Promise<TaxCalculation[]>;
  updateTaxCalculation(id: number, data: typeof insertTaxCalculationSchema._type): Promise<TaxCalculation | undefined>;
  deleteTaxCalculation(id: number): Promise<boolean>;
  getAllUsers(): Promise<Omit<StorageUser, 'password'>[]>;
  getAllReminders(page?: number, limit?: number): Promise<PaginatedResult<PaymentReminder>>;
  sessionStore: InMemoryStore;
  getAllInvoices(page?: number, limit?: number): Promise<PaginatedResult<SchemaInvoice>>;
  getAllExpenses(page?: number, limit?: number): Promise<PaginatedResult<SchemaExpense>>;
  getAllTaxCalculations(): Promise<TaxCalculation[]>;
  getRecentActivity(): Promise<SchemaActivity[]>;
  blockUser(userId: number): Promise<void>;
  createInvoice(data: Omit<SchemaInvoice, 'id' | 'createdAt'>): Promise<SchemaInvoice>;
  getInvoices(userId?: number): Promise<SchemaInvoice[]>;
  updateAdminCredentials(newUsername: string, newPassword: string): Promise<void>;
  deleteUserByUsername(username: string): Promise<void>;
}

export class SQLiteStorage implements Storage {
  private db: Database;
  public sessionStore: InMemoryStore;

  constructor() {
    this.db = new sqlite3.Database('./data.db', (err) => {
      if (err) {
        console.error('Error opening database:', err);
        throw err;
      }
    });
    this.sessionStore = new InMemoryStore();
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.serialize(() => {
      // Create users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          email TEXT,
          isAdmin BOOLEAN DEFAULT 0,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create payment reminders table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS payment_reminders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          status TEXT CHECK(status IN ('upcoming', 'overdue', 'paid')) NOT NULL,
          dueDate TEXT NOT NULL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          notificationSettings TEXT,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Create invoices table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS invoices (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          status TEXT CHECK(status IN ('draft', 'sent', 'paid', 'overdue')) NOT NULL,
          dueDate TEXT NOT NULL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Create expenses table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          date TEXT NOT NULL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Create activities table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          action TEXT NOT NULL,
          details TEXT NOT NULL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Initialize admin user
      this.initializeAdminUser().catch(err => {
        console.error('Error initializing admin user:', err);
      });
    });
  }

  private async initializeAdminUser(): Promise<void> {
    try {
      // First, delete any existing admin user
      await this.deleteUserByUsername('admin');
      
      // Create new admin user with default credentials
      const hashedPassword = await this.hashPassword('admin123');
      await this.createUser({
        username: 'admin',
        password: hashedPassword,
        name: 'Admin',
        email: 'admin@example.com',
        isAdmin: true
      });
      console.log('Admin user created successfully');
    } catch (error) {
      console.error('Error initializing admin user:', error);
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(suppliedPassword: string, storedHash: string): Promise<boolean> {
    return bcrypt.compare(suppliedPassword, storedHash);
  }

  async getUser(id: number): Promise<StorageUser | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get<StorageUser>('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async getUserByUsername(username: string): Promise<StorageUser | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get<StorageUser>('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async getUserByEmail(email: string): Promise<StorageUser | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get<StorageUser>('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async createUser(user: StorageInsertUser): Promise<StorageUser> {
    return new Promise((resolve, reject) => {
      const db = this.db;
      db.run(
        'INSERT INTO users (username, password, name, email, isAdmin) VALUES (?, ?, ?, ?, ?)',
        [user.username, user.password, user.name, user.email, user.isAdmin],
        function(this: RunResult, err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          
          const lastId = this.lastID;
          db.get<StorageUser>('SELECT * FROM users WHERE id = ?', [lastId], (err: Error | null, row: StorageUser | undefined) => {
            if (err) reject(err);
            else if (!row) reject(new Error('User not found after creation'));
            else resolve(row);
          });
        }
      );
    });
  }

  async getAllUsers(): Promise<Omit<StorageUser, 'password'>[]> {
    return new Promise((resolve, reject) => {
      this.db.all<StorageUser>('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        const usersWithoutPassword = rows.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        resolve(usersWithoutPassword);
      });
    });
  }

  async getAllReminders(page = 1, limit = 10): Promise<PaginatedResult<PaymentReminder>> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      // Get total count
      this.db.get<{ count: number }>(
        'SELECT COUNT(*) as count FROM payment_reminders',
        (err, countResult) => {
          if (err) {
            reject(err);
            return;
          }

          // Get paginated data
          this.db.all<PaymentReminder>(
            'SELECT * FROM payment_reminders ORDER BY createdAt DESC LIMIT ? OFFSET ?',
            [limit, offset],
            (err, rows) => {
              if (err) reject(err);
              else resolve({
                data: rows || [],
                total: countResult?.count || 0
              });
            }
          );
        }
      );
    });
  }

  // Tax calculation methods
  async createTaxCalculation(data: typeof insertTaxCalculationSchema._type): Promise<TaxCalculation> {
    throw new Error('Not implemented');
  }

  async getTaxCalculation(id: number): Promise<TaxCalculation | undefined> {
    throw new Error('Not implemented');
  }

  async getTaxCalculations(userId?: number): Promise<TaxCalculation[]> {
    throw new Error('Not implemented');
  }

  async updateTaxCalculation(id: number, data: typeof insertTaxCalculationSchema._type): Promise<TaxCalculation | undefined> {
    throw new Error('Not implemented');
  }

  async deleteTaxCalculation(id: number): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async getAllInvoices(page = 1, limit = 10): Promise<PaginatedResult<SchemaInvoice>> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      // Get total count
      this.db.get<{ count: number }>(
        'SELECT COUNT(*) as count FROM invoices',
        (err, countResult) => {
          if (err) {
            reject(err);
            return;
          }

          // Get paginated data
          this.db.all<SchemaInvoice>(
            'SELECT * FROM invoices ORDER BY createdAt DESC LIMIT ? OFFSET ?',
            [limit, offset],
            (err, rows) => {
              if (err) reject(err);
              else resolve({
                data: rows || [],
                total: countResult?.count || 0
              });
            }
          );
        }
      );
    });
  }

  async getAllExpenses(page = 1, limit = 10): Promise<PaginatedResult<SchemaExpense>> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      // Get total count
      this.db.get<{ count: number }>(
        'SELECT COUNT(*) as count FROM expenses',
        (err, countResult) => {
          if (err) {
            reject(err);
            return;
          }

          // Get paginated data
          this.db.all<SchemaExpense>(
            'SELECT * FROM expenses ORDER BY createdAt DESC LIMIT ? OFFSET ?',
            [limit, offset],
            (err, rows) => {
              if (err) reject(err);
              else resolve({
                data: rows || [],
                total: countResult?.count || 0
              });
            }
          );
        }
      );
    });
  }

  async getAllTaxCalculations(): Promise<TaxCalculation[]> {
    return new Promise((resolve, reject) => {
      this.db.all<TaxCalculation>('SELECT * FROM tax_calculations', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async getRecentActivity(): Promise<SchemaActivity[]> {
    return new Promise((resolve, reject) => {
      this.db.all<SchemaActivity>(
        `SELECT * FROM activities 
         ORDER BY createdAt DESC 
         LIMIT 10`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  async blockUser(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET isBlocked = 1 WHERE id = ?',
        [userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async createInvoice(data: Omit<SchemaInvoice, 'id' | 'createdAt'>): Promise<SchemaInvoice> {
    return new Promise((resolve, reject) => {
      const db = this.db;
      this.db.run(
        'INSERT INTO invoices (userId, number, amount, status) VALUES (?, ?, ?, ?)',
        [data.userId, data.number, data.amount, data.status],
        function(this: RunResult, err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          
          const lastId = this.lastID;
          db.get<SchemaInvoice>('SELECT * FROM invoices WHERE id = ?', [lastId], (err: Error | null, row: SchemaInvoice | undefined) => {
            if (err) reject(err);
            else if (!row) reject(new Error('Invoice not found after creation'));
            else resolve(row);
          });
        }
      );
    });
  }

  async getInvoices(userId?: number): Promise<SchemaInvoice[]> {
    return new Promise((resolve, reject) => {
      if (userId) {
        this.db.all<SchemaInvoice>(
          'SELECT * FROM invoices WHERE userId = ?',
          [userId],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
          }
        );
      } else {
        this.db.all<SchemaInvoice>('SELECT * FROM invoices', (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      }
    });
  }

  async updateAdminCredentials(newUsername: string, newPassword: string): Promise<void> {
    try {
      // First, check if the new username already exists
      const existingUser = await this.getUserByUsername(newUsername);
      if (existingUser && existingUser.username !== 'admin') {
        throw new Error('Username already exists');
      }

      // Get the current admin user
      const adminUser = await this.getUserByUsername('admin');
      if (!adminUser) {
        throw new Error('Admin user not found');
      }

      // Hash the new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update the admin user's credentials
      return new Promise((resolve, reject) => {
        this.db.run(
          `UPDATE users SET username = ?, password = ? WHERE username = 'admin'`,
          [newUsername, hashedPassword],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.error('Error updating admin credentials:', error);
      throw error;
    }
  }

  async deleteUserByUsername(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM users WHERE username = ?',
        [username],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

export const storage = new SQLiteStorage();

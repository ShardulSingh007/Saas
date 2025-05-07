import { z } from 'zod';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// User schema
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  email: text('email').notNull().unique(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
  isBlocked: integer('is_blocked', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Invoice schema
export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  number: text('number').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Expense schema
export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tax calculation schema
export const taxCalculations = sqliteTable('tax_calculations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  income: real('income').notNull(),
  deductions: real('deductions').notNull(),
  tax: real('tax').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Activity log schema
export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  details: text('details'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type TaxCalculation = typeof taxCalculations.$inferSelect;
export type Activity = typeof activities.$inferSelect;

// Zod schemas
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().optional(),
  email: z.string().email(),
  isAdmin: z.boolean().default(false),
});

export const insertInvoiceSchema = z.object({
  userId: z.number(),
  number: z.string(),
  amount: z.number(),
  status: z.string(),
});

export const insertExpenseSchema = z.object({
  userId: z.number(),
  amount: z.number(),
  category: z.string(),
  description: z.string().optional(),
});

export const insertTaxCalculationSchema = z.object({
  userId: z.number(),
  income: z.number(),
  deductions: z.number(),
  tax: z.number(),
});

export const insertActivitySchema = z.object({
  userId: z.number(),
  action: z.string(),
  details: z.string().optional(),
});

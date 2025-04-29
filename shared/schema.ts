import { pgTable, text, serial, integer, boolean, json, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  isAdmin: true,
});

// Tax Calculation model
export const taxCalculations = pgTable("tax_calculations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  country: text("country").notNull(),
  taxYear: integer("tax_year").notNull(),
  filingStatus: text("filing_status").notNull(),
  age: integer("age"),
  incomeData: json("income_data").notNull(),
  deductionsData: json("deductions_data"),
  creditsData: json("credits_data"),
  calculationResults: json("calculation_results"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTaxCalculationSchema = createInsertSchema(taxCalculations).omit({
  id: true,
  createdAt: true, 
  updatedAt: true
});

// Schema validation for income data
export const incomeDataSchema = z.object({
  employment: z.object({
    salary: z.number().min(0),
    withheld: z.number().min(0),
  }),
  selfEmployment: z.object({
    business: z.number().min(0),
    expenses: z.number().min(0),
  }),
  investment: z.object({
    dividends: z.number().min(0),
    capitalGains: z.number().min(0),
  }),
  other: z.array(
    z.object({
      name: z.string(),
      amount: z.number().min(0),
    })
  ).default([]),
});

// Schema validation for deductions data
export const deductionsDataSchema = z.object({
  standard: z.boolean().default(true),
  itemized: z.object({
    mortgage: z.number().min(0).default(0),
    stateTaxes: z.number().min(0).default(0),
    charitableDonations: z.number().min(0).default(0),
    medicalExpenses: z.number().min(0).default(0),
    studentLoanInterest: z.number().min(0).default(0),
    retirement: z.number().min(0).default(0),
    other: z.array(
      z.object({
        name: z.string(),
        amount: z.number().min(0),
      })
    ).default([]),
  }),
});

// Schema validation for credits data
export const creditsDataSchema = z.object({
  childTaxCredit: z.object({
    qualifying: z.number().min(0).default(0),
  }),
  earnedIncome: z.boolean().default(false),
  education: z.object({
    tuition: z.number().min(0).default(0),
  }),
  other: z.array(
    z.object({
      name: z.string(),
      amount: z.number().min(0),
    })
  ).default([]),
});

// Schema validation for calculation results
export const calculationResultsSchema = z.object({
  totalIncome: z.number(),
  adjustedGrossIncome: z.number(),
  totalDeductions: z.number(),
  taxableIncome: z.number(),
  federalTax: z.number(),
  stateTax: z.number(),
  selfEmploymentTax: z.number(),
  totalTax: z.number(),
  effectiveTaxRate: z.number(),
  takeHomePay: z.number(),
  taxBrackets: z.array(
    z.object({
      min: z.number(),
      max: z.number().nullable(),
      rate: z.number(),
      tax: z.number(),
    })
  ),
  taxSavingsTips: z.array(
    z.object({
      description: z.string(),
      savings: z.number(),
    })
  ).optional(),
});

// Schema for Sales Tax / VAT Calculation
export const salesTaxCalculationSchema = z.object({
  amount: z.number().min(0),
  taxRate: z.number().min(0),
  taxAmount: z.number().min(0),
  totalAmount: z.number().min(0)
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TaxCalculation = typeof taxCalculations.$inferSelect;
export type InsertTaxCalculation = z.infer<typeof insertTaxCalculationSchema>;
export type IncomeData = z.infer<typeof incomeDataSchema>;
export type DeductionsData = z.infer<typeof deductionsDataSchema>;
export type CreditsData = z.infer<typeof creditsDataSchema>;
export type CalculationResults = z.infer<typeof calculationResultsSchema>;
export type SalesTaxCalculation = z.infer<typeof salesTaxCalculationSchema>;

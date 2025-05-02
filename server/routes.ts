import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaxCalculationSchema, calculationResultsSchema, insertUserSchema } from "@shared/schema";
import { json } from "express";
import session from "express-session";
import crypto from "crypto";
import { sendEmail } from "./email";

// Set up authentication
function setupAuth(app: Express) {
  // Generate random session secret
  const sessionSecret = crypto.randomBytes(32).toString('hex');

  // Configure session middleware
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000, // 1 day in ms
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  }));

  // Authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Extract username from email (before the @ symbol)
      const username = email.split('@')[0];

      const existingUser = await storage.getUserByUsername(username);

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      const hashedPassword = await storage.hashPassword(password);

      // Create user with username derived from email
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        name: name || username,
        email,
        isAdmin: email === 'admin@example.com' ? true : false,
      });

      // Save user info in session (excluding password)
      const { password: _, ...userInfo } = user;
      (req.session as any).user = userInfo;

      return res.status(201).json(userInfo);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Try to find user by email (checking if username matches email username part)
      const username = email.split('@')[0];
      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await storage.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Save user info in session (excluding password)
      const { password: _, ...userInfo } = user;
      (req.session as any).user = userInfo;

      return res.json(userInfo);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  });

  // Admin login endpoint
  app.post('/api/auth/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await storage.getUserByUsername(username);

      if (!user || !user.isAdmin) {
        // Don't reveal if it's a non-admin account for security
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const isPasswordValid = await storage.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      // Save user info in session (excluding password)
      const { password: _, ...userInfo } = user;
      (req.session as any).user = userInfo;

      return res.json(userInfo);
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'An error occurred during admin login' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }

      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.json(user);
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  // User tax calculation routes
  app.post('/api/tax-calculations', async (req, res) => {
    try {
      const data = insertTaxCalculationSchema.parse(req.body);
      const calculation = await storage.createTaxCalculation(data);
      res.status(201).json(calculation);
    } catch (error) {
      res.status(400).json({ error: 'Invalid tax calculation data' });
    }
  });

  app.get('/api/tax-calculations', async (req, res) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const calculations = await storage.getTaxCalculations(userId);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve tax calculations' });
    }
  });

  app.get('/api/tax-calculations/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const calculation = await storage.getTaxCalculation(id);

      if (!calculation) {
        return res.status(404).json({ error: 'Tax calculation not found' });
      }

      res.json(calculation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve tax calculation' });
    }
  });

  app.put('/api/tax-calculations/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = insertTaxCalculationSchema.parse(req.body);
      const updatedCalculation = await storage.updateTaxCalculation(id, data);

      if (!updatedCalculation) {
        return res.status(404).json({ error: 'Tax calculation not found' });
      }

      res.json(updatedCalculation);
    } catch (error) {
      res.status(400).json({ error: 'Invalid tax calculation data' });
    }
  });

  app.delete('/api/tax-calculations/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteTaxCalculation(id);

      if (!success) {
        return res.status(404).json({ error: 'Tax calculation not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete tax calculation' });
    }
  });

  // Tax reference data routes
  app.get('/api/tax-reference/countries', (req, res) => {
    res.json([
      { id: 'us', name: 'United States' },
      { id: 'ca', name: 'Canada' },
      { id: 'uk', name: 'United Kingdom' },
      { id: 'au', name: 'Australia' },
    ]);
  });

  app.get('/api/tax-reference/years', (req, res) => {
    res.json([
      { id: 2023, name: '2023' },
      { id: 2022, name: '2022' },
      { id: 2021, name: '2021' },
    ]);
  });

  app.get('/api/tax-reference/filing-statuses', (req, res) => {
    const country = req.query.country || 'us';

    const filingStatuses: Record<string, any[]> = {
      us: [
        { id: 'single', name: 'Single' },
        { id: 'mfj', name: 'Married Filing Jointly' },
        { id: 'mfs', name: 'Married Filing Separately' },
        { id: 'hoh', name: 'Head of Household' },
      ],
      ca: [
        { id: 'single', name: 'Single' },
        { id: 'married', name: 'Married or Common-Law' },
      ],
      uk: [
        { id: 'single', name: 'Individual' },
      ],
      au: [
        { id: 'single', name: 'Individual' },
      ],
    };

    res.json(filingStatuses[country as string] || filingStatuses.us);
  });

  // Invoice email sending endpoint
  app.post('/api/send-invoice', async (req, res) => {
    try {
      const { 
        recipientEmail, 
        senderEmail, 
        invoiceNumber, 
        invoicePdfBase64, 
        businessName,
        amount,
        dueDate
      } = req.body;

      if (!recipientEmail || !senderEmail || !invoiceNumber || !invoicePdfBase64) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields for sending invoice email' 
        });
      }

      // Format the email
      const subject = `Invoice #${invoiceNumber} from ${businessName || 'Your Business'}`;
      const text = `Please find attached Invoice #${invoiceNumber} for ${amount || 'the requested services'}. Payment is due by ${dueDate || 'the specified date'}. Thank you for your business.`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invoice #${invoiceNumber}</h2>
          <p>Thank you for your business. Please find your invoice attached to this email.</p>
          <p><strong>Amount Due:</strong> ${amount || 'See attached invoice'}</p>
          <p><strong>Due Date:</strong> ${dueDate || 'See attached invoice'}</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>${businessName || 'Your Business'}</p>
        </div>
      `;

      // Send the email with attachment
      const emailSent = await sendEmail({
        to: recipientEmail,
        from: senderEmail,
        subject,
        text,
        html,
        attachments: [
          {
            content: invoicePdfBase64,
            filename: `Invoice-${invoiceNumber}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      });

      if (emailSent) {
        return res.status(200).json({ success: true, message: 'Invoice email sent successfully' });
      } else {
        return res.status(500).json({ success: false, error: 'Failed to send invoice email' });
      }
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // AI Finance Buddy endpoint
  app.post('/api/finance-buddy/chat', async (req, res) => {
    try {
      const { message, expenseData } = req.body;

      if (!message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing message in request' 
        });
      }

      // Import Anthropic here to avoid issues during startup if API key isn't available
      const Anthropic = require('@anthropic-ai/sdk').default;

      if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'ANTHROPIC_API_KEY is not configured'
        });
      }

      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      // Format expense data for the AI
      const expenseSummary = formatExpenseData(expenseData);

      // Generate AI response
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219', // The newest Anthropic model
        max_tokens: 1000,
        temperature: 0.7,
        system: `You are Finny, a friendly and helpful AI Finance Buddy. 
        You provide practical and personalized financial advice based on the user's expense data.
        Keep your responses encouraging, upbeat, and easy to understand.
        Personalize your advice based on the expense summary provided.
        Use simple language and avoid being overly technical.
        Aim to provide 2-3 actionable suggestions in each response.
        Be conversational and use emojis occasionally to seem friendly.`,
        messages: [
          {
            role: 'user',
            content: `Here's my question: "${message}"\n\nHere's a summary of my recent expenses:\n${expenseSummary}`,
          },
        ],
      });

      return res.status(200).json({ 
        success: true, 
        message: response.content[0].text
      });

    } catch (error) {
      console.error('Error generating AI response:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to generate AI response' 
      });
    }
  });

  function formatExpenseData(expenseData: any): string {
    if (!expenseData || !expenseData.expenses || expenseData.expenses.length === 0) {
      return "No expense data provided.";
    }

    const { expenses, categoryTotals, monthlyTotal } = expenseData;

    let summary = `Monthly total: $${monthlyTotal.toFixed(2)}\n\n`;

    summary += "Top expense categories:\n";
    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 3);

    sortedCategories.forEach(([category, amount]: [string, any]) => {
      const percentage = (amount / monthlyTotal) * 100;
      summary += `- ${category}: $${amount.toFixed(2)} (${percentage.toFixed(1)}%)\n`;
    });

    summary += "\nRecent transactions:\n";
    expenses.slice(0, 5).forEach((expense: any) => {
      summary += `- $${expense.amount.toFixed(2)} for ${expense.description} (${expense.category})\n`;
    });

    return summary;
  }

  // Invoice management routes
  app.post('/api/invoices', async (req, res) => {
    try {
      const { user } = req.session as any;
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const invoice = await storage.createInvoice({
        ...req.body,
        userId: user.id
      });

      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save invoice' });
    }
  });

  app.get('/api/invoices', async (req, res) => {
    try {
      const { user } = req.session as any;
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const invoices = await storage.getInvoices(user.id);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', async (req, res) => {
    try {
      const { user } = req.session as any;
      if (!user?.isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.get('/api/admin/invoices', async (req, res) => {
    try {
      const { user } = req.session as any;
      if (!user?.isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
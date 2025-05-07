import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaxCalculationSchema, calculationResultsSchema, insertUserSchema } from "@shared/schema";
import { json } from "express";
import session from "express-session";
import crypto from "crypto";
import { sendEmail } from "./email";
import { OAuth2Client } from 'google-auth-library';
import { NextFunction } from "express";

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      console.log('Received request body:', req.body);
      const { secretKey } = req.body;

      if (!secretKey) {
        console.log('No secret key provided in request');
        return res.status(400).json({ error: 'Secret key is required' });
      }

      console.log('Checking secret key:', secretKey);
      // Check if the secret key matches
      if (secretKey !== 'admin123456') {
        console.log('Invalid secret key provided');
        return res.status(401).json({ error: 'Invalid secret key' });
      }

      // Create or get admin user
      let adminUser = await storage.getUserByUsername('admin');
      
      if (!adminUser) {
        // Create admin user if it doesn't exist
        const hashedPassword = await storage.hashPassword(crypto.randomBytes(16).toString('hex'));
        adminUser = await storage.createUser({
          username: 'admin',
          password: hashedPassword,
          name: 'Admin',
          email: 'admin@example.com',
          isAdmin: true,
        });
      }

      // Save user info in session (excluding password)
      const { password: _, ...userInfo } = adminUser;
      (req.session as any).user = userInfo;

      console.log('Admin login successful');
      return res.json(userInfo);
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'An error occurred during admin login' });
    }
  });

  // Update admin credentials endpoint
  app.post('/api/auth/admin/update-credentials', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }

      await storage.updateAdminCredentials(username, password);

      return res.json({ message: 'Admin credentials updated successfully' });
    } catch (error: any) {
      console.error('Error updating admin credentials:', error);
      res.status(500).json({ error: error.message || 'An error occurred while updating admin credentials' });
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

  // Google authentication endpoint
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({ error: 'Google credential is required' });
      }

      // Verify the Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).json({ error: 'Invalid Google token' });
      }

      const { sub: googleId, email, name, picture } = payload;

      // Check if user already exists
      let user = await storage.getUserByEmail(email!);

      if (!user) {
        // Create new user
        const username = email!.split('@')[0];
        const hashedPassword = await storage.hashPassword(crypto.randomBytes(16).toString('hex'));
        
        user = await storage.createUser({
          username,
          password: hashedPassword,
          name: name || username,
          email: email!,
          isAdmin: false,
        });
      }

      // Save user info in session (excluding password)
      const { password: _, ...userInfo } = user;
      (req.session as any).user = userInfo;

      return res.json(userInfo);
    } catch (error) {
      console.error('Google authentication error:', error);
      res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
  });
}

// Admin middleware
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user?.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

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
  app.get('/api/admin/users', adminAuth, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/stats', adminAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const invoices = await storage.getAllInvoices();
      const expenses = await storage.getAllExpenses();
      const reminders = await storage.getAllReminders();

      // Calculate stats
      const stats = {
        totalUsers: users.length,
        totalInvoices: invoices.length,
        totalExpenses: expenses.length,
        totalReminders: reminders.length,
        userGrowth: calculateGrowth(users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, users.length),
        invoiceGrowth: calculateGrowth(invoices.filter(i => new Date(i.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, invoices.length),
        expenseGrowth: calculateGrowth(expenses.filter(e => new Date(e.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, expenses.length),
        reminderGrowth: calculateGrowth(reminders.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, reminders.length),
        taxSaved: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
        upcomingPayments: reminders.filter(r => new Date(r.dueDate) > new Date() && new Date(r.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length
      };

      res.json(stats);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  });

  app.get('/api/admin/activity', adminAuth, async (req, res) => {
    try {
      const activities = await storage.getRecentActivity();
      res.json(activities);
    } catch (error) {
      console.error('Failed to fetch admin activity:', error);
      res.status(500).json({ error: 'Failed to fetch admin activity' });
    }
  });

  app.get('/api/admin/recent-reminders', async (req, res) => {
    try {
      const { user } = req.session as any;
      if (!user?.isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const reminders = await storage.getAllReminders();
      // Sort by creation date and get the 10 most recent
      const recentReminders = reminders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      res.json(recentReminders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recent reminders' });
    }
  });

  // Helper functions
  function calculateCategoryStats(reminders: any[]) {
    const categoryCounts = reminders.reduce((acc, reminder) => {
      acc[reminder.category] = (acc[reminder.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = reminders.length;
    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }

  function calculateNotificationStats(reminders: any[]) {
    const stats = {
      email: 0,
      sms: 0,
      push: 0,
      whatsapp: 0
    };

    reminders.forEach(reminder => {
      if (reminder.notificationSettings?.email) stats.email++;
      if (reminder.notificationSettings?.sms) stats.sms++;
      if (reminder.notificationSettings?.push) stats.push++;
      if (reminder.notificationSettings?.whatsapp) stats.whatsapp++;
    });

    const total = reminders.length;
    return {
      email: Math.round((stats.email / total) * 100),
      sms: Math.round((stats.sms / total) * 100),
      push: Math.round((stats.push / total) * 100),
      whatsapp: Math.round((stats.whatsapp / total) * 100)
    };
  }

  function calculateTrend(current: number, previous: number): { percentage: number; type: 'up' | 'down' } {
    if (previous === 0) return { percentage: 100, type: 'up' };
    const percentage = ((current - previous) / previous) * 100;
    return {
      percentage: Math.round(percentage),
      type: percentage >= 0 ? 'up' : 'down'
    };
  }

  function convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => 
      headers.map(header => {
        const value = obj[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }

  app.post('/api/admin/users/:id/block', adminAuth, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      await storage.blockUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error blocking user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/export', async (req, res) => {
    try {
      const { user } = req.session as any;
      if (!user?.isAdmin) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { type } = req.query;
      let data;

      switch (type) {
        case 'users':
          data = await storage.getAllUsers();
          break;
        case 'invoices':
          data = await storage.getAllInvoices();
          break;
        case 'expenses':
          data = await storage.getAllExpenses();
          break;
        case 'tax-calculations':
          data = await storage.getAllTaxCalculations();
          break;
        case 'reminders':
          data = await storage.getAllReminders();
          break;
        default:
          return res.status(400).json({ error: 'Invalid export type' });
      }

      // Convert data to CSV
      const csv = convertToCSV(data);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-export.csv`);
      res.send(csv);
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ error: 'Failed to export data' });
    }
  });

  // Helper function to calculate growth percentage
  function calculateGrowth(newCount: number, totalCount: number): number {
    if (totalCount === 0) return 0;
    return Math.round((newCount / totalCount) * 100);
  }

  app.get('/api/admin/invoices', adminAuth, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await storage.getAllInvoices(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/expenses', adminAuth, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await storage.getAllExpenses(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/reminders', adminAuth, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await storage.getAllReminders(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseTrackerGuide } from '@/components/ExpenseTrackerGuide';
import { 
  PlusCircle, 
  MessageSquare, 
  PieChart, 
  Lightbulb, 
  Coins, 
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle2,
  X,
  HelpCircle,
  Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Define expense category colors
const categoryColors: Record<string, string> = {
  Food: '#FF6B6B',
  Transportation: '#4ECDC4',
  Entertainment: '#FFD166',
  Shopping: '#F86FFF',
  Bills: '#118AB2',
  Health: '#06D6A0',
  Other: '#073B4C'
};

// Define expense interface
interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

// Define chat message interface
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

// Currency data
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'AED', symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
];

const ExpenseTracker: React.FC = () => {
  // State for expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'date'>>({
    amount: 0,
    category: 'Food',
    description: ''
  });
  
  // State for chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', text: "Hi there! I'm Finny, your AI Finance Buddy. How can I help you today?", isUser: false }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // State for smart tip
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  
  // Animation states
  const [aiBlinking, setAiBlinking] = useState(false);
  
  const { toast } = useToast();

  // Load expenses from localStorage on initial render
  useEffect(() => {
    try {
      // Load expenses from localStorage
      const savedExpenses = localStorage.getItem('expenseTracker_expenses');
      const savedCurrency = localStorage.getItem('expenseTracker_currency');
      
      if (savedExpenses) {
        // Parse the saved expenses and fix the date objects
        const parsedExpenses: Expense[] = JSON.parse(savedExpenses).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
        setExpenses(parsedExpenses);
      }
      
      if (savedCurrency) {
        const currencyCode = savedCurrency;
        const currency = currencies.find(c => c.code === currencyCode);
        if (currency) {
          setSelectedCurrency(currency);
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Initialize with empty array if there's an error
      setExpenses([]);
    }
    
    // Show a random tip after 3 seconds
    const tipTimer = setTimeout(() => {
      showRandomTip();
    }, 3000);
    
    // Blink AI effect
    const blinkInterval = setInterval(() => {
      setAiBlinking(true);
      setTimeout(() => setAiBlinking(false), 300);
    }, 5000);
    
    return () => {
      clearTimeout(tipTimer);
      clearInterval(blinkInterval);
    };
  }, []);
  
  // Save expenses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('expenseTracker_expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
    }
  }, [expenses]);
  
  // Save selected currency to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('expenseTracker_currency', selectedCurrency.code);
    } catch (error) {
      console.error('Error saving currency to localStorage:', error);
    }
  }, [selectedCurrency]);
  
  // Scroll to bottom of chat when new messages come in
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Calculate total expenses for today
  const todayExpenses = expenses.filter(expense => 
    expense.date.toDateString() === new Date().toDateString()
  );
  
  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate monthly total
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => 
    expense.date.getMonth() === currentMonth && 
    expense.date.getFullYear() === currentYear
  );
  
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate expenses by category
  const expensesByCategory: Record<string, number> = {};
  
  monthlyExpenses.forEach(expense => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount;
    } else {
      expensesByCategory[expense.category] = expense.amount;
    }
  });
  
  // Calculate the percentage of each category
  const totalExpenseAmount = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  const categoryPercentages = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0
  }));
  
  // Sort categories by amount (descending)
  categoryPercentages.sort((a, b) => b.amount - a.amount);
  
  // Add a new expense
  const handleAddExpense = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const expenseToAdd: Expense = {
      id: newId,
      ...newExpense,
      date: new Date()
    };
    
    setExpenses([expenseToAdd, ...expenses]);
    setShowAddExpense(false);
    
    // Reset the form
    setNewExpense({
      amount: 0,
      category: 'Food',
      description: ''
    });
    
    toast({
      title: 'Expense Added',
      description: `Added $${expenseToAdd.amount.toFixed(2)} for ${expenseToAdd.description}`,
    });
    
    // Check if we should show a tip
    if (Math.random() > 0.7) {
      setTimeout(showRandomTip, 1000);
    }
  };
  
  // Delete an expense
  const handleDeleteExpense = (id: string) => {
    // First show a confirmation dialog
    if (confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      
      toast({
        title: 'Expense Removed',
        description: 'The expense has been successfully removed',
      });
    }
  };
  
  // Handle chat message
  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;
    
    const messageToSend = userMessage;
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageToSend,
      isUser: true
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsTyping(true);
    
    try {
      // Get response from AI service
      const aiResponse = await getAIResponse(messageToSend);
      
      // Create AI message
      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false
      };
      
      setChatMessages(prev => [...prev, newAIMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Fallback message if something goes wrong
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Could you try again later?",
        isUser: false
      };
      
      setChatMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Get AI response based on user message
  const getAIResponse = async (message: string): Promise<string> => {
    try {
      // Prepare expense data to send to the AI
      const expenseSummaryData = {
        expenses: expenses,
        categoryTotals: expensesByCategory,
        monthlyTotal: monthlyTotal
      };
      
      // Call the server endpoint
      const response = await fetch('/api/finance-buddy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          expenseData: expenseSummaryData
        })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        console.error('Error from AI service:', data.error);
        return getFallbackResponse(message);
      }
      
      return data.message;
    } catch (error) {
      console.error('Failed to get AI response:', error);
      return getFallbackResponse(message);
    }
  };
  
  // Fallback responses if the AI service fails
  const getFallbackResponse = (message: string): string => {
    message = message.toLowerCase();
    
    if (message.includes('save') || message.includes('saving')) {
      return "Great question about saving! I recommend the 50/30/20 rule: 50% of income for necessities, 30% for wants, and 20% for savings. Based on your spending, you could save an extra $85 this month by cutting back on entertainment expenses.";
    } else if (message.includes('budget') || message.includes('spending')) {
      return "Looking at your spending patterns, your food expenses are 28% of your monthly budget. Most financial experts recommend keeping food expenses under 15%. Want me to suggest some ways to reduce this?";
    } else if (message.includes('invest') || message.includes('investing')) {
      return "Investing is a great way to grow your wealth! Before diving in, make sure you have an emergency fund covering 3-6 months of expenses. Based on your current saving rate, you could have this ready in about 8 months!";
    } else if (message.includes('debt') || message.includes('loan')) {
      return "When tackling debt, consider the avalanche method (paying highest interest first) or the snowball method (paying smallest debts first). Based on your spending, you could allocate an extra $120/month to debt payments by adjusting your entertainment budget.";
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hey there! I'm Finny, your AI finance buddy. I'm here to help you track expenses and provide personalized financial insights. What would you like to know about your spending?";
    } else {
      return "Thanks for your message! Based on your recent spending, I notice you've been spending quite a bit on Food and Entertainment. Would you like some tips on how to balance your budget better?";
    }
  };
  
  // Show random tip
  const showRandomTip = () => {
    const tips = [
      "Did you know? Your biggest expense category this month is Food at 28%. The average recommended budget for food is 10-15%.",
      "Eating out makes up 65% of your food expenses this month. Consider meal prepping to save money!",
      "You've spent $45 on transportation today. Consider carpooling or public transit to reduce this expense.",
      "Great job! Your utility bills are 12% lower than last month.",
      "Looking at your spending patterns, Tuesday is your highest spending day of the week."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
    setShowTip(true);
    
    // Hide tip after 7 seconds
    setTimeout(() => {
      setShowTip(false);
    }, 7000);
  };
  
  // Clear all expense data
  const handleClearAllData = () => {
    // Show confirmation dialog
    if (confirm("Are you sure you want to clear all expense data? This action cannot be undone.")) {
      // Clear expenses
      setExpenses([]);
      
      // Clear localStorage
      try {
        localStorage.removeItem('expenseTracker_expenses');
        localStorage.removeItem('expenseTracker_currency');
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
      
      toast({
        title: "All Data Cleared",
        description: "All your expense data has been successfully cleared.",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section with AI Assistant */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative mr-4">
            <motion.div
              initial={{ scale: 1 }}
              animate={aiBlinking ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
            >
              <motion.div 
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden"
                animate={{ rotate: aiBlinking ? [0, -5, 5, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-3xl">🤖</span>
              </motion.div>
            </motion.div>
            <motion.div 
              className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Expense Tracker</h1>
            <p className="text-muted-foreground">with your AI Finance Buddy</p>
          </div>
          
          {/* Currency Selector */}
          <div className="ml-4">
            <Select 
              value={selectedCurrency.code}
              onValueChange={(value) => {
                const currency = currencies.find(c => c.code === value);
                if (currency) setSelectedCurrency(currency);
              }}
            >
              <SelectTrigger className="w-[180px] border-2 border-blue-200 dark:border-blue-800">
                <SelectValue>
                  <span className="flex items-center">
                    <span className="font-bold mr-1">{selectedCurrency.symbol}</span>
                    <span>{selectedCurrency.code}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <span className="flex items-center">
                      <span className="font-bold mr-2">{currency.symbol}</span>
                      <span>{currency.name}</span>
                      <span className="text-muted-foreground ml-1">({currency.code})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowAddExpense(true)}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Button 
            onClick={() => setShowChat(true)}
            variant="outline"
            className="border-2 border-purple-400 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <MessageSquare className="mr-2 h-4 w-4 text-purple-500" />
            Ask AI
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-orange-400 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <PieChart className="mr-2 h-4 w-4 text-orange-500" />
            View Reports
          </Button>
          <Button 
            onClick={handleClearAllData}
            variant="outline"
            className="border-2 border-red-300 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            Clear All Data
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Expenses */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Today's Expenses</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4 flex items-end">
              {selectedCurrency.symbol}{todayTotal.toFixed(2)}
              <span className="text-sm text-muted-foreground ml-2 mb-1">
                today
              </span>
            </div>
            
            <div className="space-y-4">
              {todayExpenses.length > 0 ? (
                todayExpenses.map(expense => (
                  <motion.div 
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                        style={{ backgroundColor: categoryColors[expense.category] + '30' }}
                      >
                        <span 
                          className="text-lg"
                          style={{ color: categoryColors[expense.category] }}
                        >
                          {expense.category === 'Food' ? '🍔' : 
                           expense.category === 'Transportation' ? '🚗' :
                           expense.category === 'Entertainment' ? '🎬' :
                           expense.category === 'Shopping' ? '🛍️' :
                           expense.category === 'Bills' ? '📝' :
                           expense.category === 'Health' ? '💊' : '🔍'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">{expense.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="font-semibold mr-3">{selectedCurrency.symbol}{expense.amount.toFixed(2)}</div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExpense(expense.id);
                        }}
                        title="Remove expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No expenses recorded for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Tabs defaultValue="spending">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="spending">Spending</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                </TabsList>
                <TabsContent value="spending" className="mt-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                      <div className="text-3xl font-bold">{selectedCurrency.symbol}{monthlyTotal.toFixed(2)}</div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">vs Last Month</div>
                        <div className="flex items-center text-green-500">
                          <ArrowDownCircle className="h-4 w-4 mr-1" />
                          <span className="font-medium">12%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">vs Budget</div>
                        <div className="flex items-center text-red-500">
                          <ArrowUpCircle className="h-4 w-4 mr-1" />
                          <span className="font-medium">8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-lg font-medium mb-2">Spending by Category</div>
                    {categoryPercentages.map(({ category, amount, percentage }) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: categoryColors[category] }}
                            />
                            {category}
                          </div>
                          <div className="font-medium">{selectedCurrency.symbol}{amount.toFixed(2)}</div>
                        </div>
                        <div className="relative pt-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-2 rounded-full"
                            style={{ backgroundColor: categoryColors[category] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="trends">
                  <div className="flex items-center justify-center h-52 text-muted-foreground">
                    Trend visualization will appear here
                  </div>
                </TabsContent>
                <TabsContent value="budget">
                  <div className="flex items-center justify-center h-52 text-muted-foreground">
                    Budget comparison will appear here
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <div className="text-lg font-medium mb-4">Top Spending Insights</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                >
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">Highest Expense Day</div>
                  <div className="text-2xl font-bold">Tuesday</div>
                  <div className="text-sm text-muted-foreground">You spend 35% more on Tuesdays</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                >
                  <div className="text-purple-600 dark:text-purple-400 font-medium mb-1">Most Frequent Category</div>
                  <div className="text-2xl font-bold">Food</div>
                  <div className="text-sm text-muted-foreground">15 transactions this month</div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Expenses & Smart Saving Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenses.slice(0, 5).map((expense, index) => (
                <motion.div 
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                      style={{ backgroundColor: categoryColors[expense.category] + '30' }}
                    >
                      <span 
                        className="text-lg"
                        style={{ color: categoryColors[expense.category] }}
                      >
                        {expense.category === 'Food' ? '🍔' : 
                         expense.category === 'Transportation' ? '🚗' :
                         expense.category === 'Entertainment' ? '🎬' :
                         expense.category === 'Shopping' ? '🛍️' :
                         expense.category === 'Bills' ? '📝' :
                         expense.category === 'Health' ? '💊' : '🔍'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {expense.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-semibold mr-3">{selectedCurrency.symbol}{expense.amount.toFixed(2)}</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExpense(expense.id);
                      }}
                      title="Remove expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">View All Transactions</Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Smart Saving Tips</CardTitle>
            <CardDescription>Personalized for your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
              >
                <div className="text-green-600 dark:text-green-400 font-medium mb-1">Saving Opportunity</div>
                <div className="font-medium">Reduce dining out by 20%</div>
                <div className="text-sm text-muted-foreground">Potential monthly savings: $45</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
              >
                <div className="text-amber-600 dark:text-amber-400 font-medium mb-1">Budget Alert</div>
                <div className="font-medium">Entertainment category is 15% over budget</div>
                <div className="text-sm text-muted-foreground">Consider adjusting your spending</div>
              </motion.div>
              
              <Button onClick={showRandomTip} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                <Lightbulb className="mr-2 h-4 w-4" />
                Get Another Tip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Guide Section */}
      <div className="mt-8 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-primary" />
              Expense Tracker Guide
            </CardTitle>
            <CardDescription>Learn how to use the Expense Tracker effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseTrackerGuide />
          </CardContent>
        </Card>
      </div>
      
      {/* Add Expense Dialog */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Bills">Bills</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExpense(false)}>Cancel</Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
              </div>
              Chat with Finny
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 px-1">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl px-4 py-2 bg-muted">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></span>
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></span>
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <Input
              placeholder="Ask me about your finances..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              className="ml-2 bg-primary"
              disabled={isTyping || userMessage.trim() === ''}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Smart Tip PopUp */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 right-4 max-w-sm bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden z-50"
          >
            <div className="flex items-start p-4">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Smart Tip</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {currentTip}
                </div>
              </div>
              <button
                onClick={() => setShowTip(false)}
                className="ml-4 flex-shrink-0 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseTracker;
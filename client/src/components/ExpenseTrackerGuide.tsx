import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  PieChart, 
  BarChart, 
  DollarSign, 
  Tag, 
  Calendar, 
  Camera,
  MessageSquare,
  Settings,
  TrendingUp,
  Download
} from 'lucide-react';

export function ExpenseTrackerGuide() {
  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Expense Tracker Guide
        </CardTitle>
        <CardDescription className="text-green-100">
          Mastering your expense tracking with Finance Buddy
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                Adding Expenses
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Click the <strong>+ Add Expense</strong> button to log a new expense</li>
                <li>Enter the amount, category, and description</li>
                <li>Select the date when the expense occurred</li>
                <li>Upload receipt image (optional) for record keeping</li>
                <li>Add tags to further organize your expenses</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Tag className="mr-2 h-5 w-5 text-green-500" />
                Categories & Tags
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Use predefined categories or create custom ones</li>
                <li>Assign multiple tags to an expense for detailed filtering</li>
                <li>Color code categories for easy visual recognition</li>
                <li>Set budget limits for each category</li>
                <li>Get alerts when approaching or exceeding category budgets</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-green-500" />
                Analyzing Expenses
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>View interactive charts showing expense distribution</li>
                <li>Toggle between daily, weekly, monthly, and yearly views</li>
                <li>Compare spending across different time periods</li>
                <li>Drill down into specific categories to see detailed breakdowns</li>
                <li>Identify spending trends and patterns with AI-powered insights</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-green-500" />
                AI Finance Buddy Chat
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Chat with your AI Finance Buddy for personalized insights</li>
                <li>Ask questions about your spending habits and patterns</li>
                <li>Get recommendations for reducing expenses in specific categories</li>
                <li>Receive custom savings tips based on your spending history</li>
                <li>Ask for help with budgeting and financial goal setting</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Camera className="mr-2 h-5 w-5 text-green-500" />
                Receipt Scanning
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Upload images of receipts to automatically extract details</li>
                <li>AI will detect amount, date, merchant, and categories</li>
                <li>Review and confirm extracted information</li>
                <li>Store receipt images for future reference</li>
                <li>Search through receipts using text found in the images</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-green-500" />
                Budget Management
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Set overall monthly budget and category-specific limits</li>
                <li>Track progress with visual budget bars</li>
                <li>Receive alerts when approaching or exceeding budgets</li>
                <li>Adjust budgets based on AI recommendations</li>
                <li>Roll over unused budget to the next period (optional)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Spending Insights
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>View detailed spending insights and patterns</li>
                <li>Identify top spending categories and merchants</li>
                <li>Discover unusual or potentially wasteful expenses</li>
                <li>Get recommendations for potential savings opportunities</li>
                <li>Set personal challenges to reduce spending in specific areas</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Download className="mr-2 h-5 w-5 text-green-500" />
                Exporting Data
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Export expense data in CSV or PDF formats</li>
                <li>Generate detailed expense reports for specific time periods</li>
                <li>Create tax-friendly reports for deductible expenses</li>
                <li>Share expense reports with accountants or financial advisors</li>
                <li>Schedule automatic monthly or quarterly reports</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-9">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-green-500" />
                Currency & Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Select your preferred currency from the dropdown menu</li>
                <li>All expenses will be displayed in your selected currency</li>
                <li>Change date format and other display preferences</li>
                <li>Configure default categories for new expenses</li>
                <li>Customize notification settings for budget alerts</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
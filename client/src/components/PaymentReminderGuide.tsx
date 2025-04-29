import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Bell, 
  Calendar, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Share2, 
  Repeat, 
  Settings, 
  Smile,
  Award
} from 'lucide-react';

export function PaymentReminderGuide() {
  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Payment Reminder Guide
        </CardTitle>
        <CardDescription className="text-blue-100">
          Get the most out of your Finance Buddy
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Creating Payment Reminders
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Click the <strong>+ Add Payment</strong> button to create a new reminder</li>
                <li>Fill in payment details like title, amount, and due date</li>
                <li>Select a category to help organize your payments</li>
                <li>Add payment link (optional) to quickly pay bills online</li>
                <li>Set up notification preferences to get alerted before due date</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-blue-500" />
                Notification Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Enable multiple notification channels (email, SMS, push, WhatsApp)</li>
                <li>Set timing preferences (days before due date)</li>
                <li>Choose notification sound from available options</li>
                <li>Set emotional tone (gentle, professional, or urgent)</li>
                <li>Customize notification messages with personal notes</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Repeat className="mr-2 h-5 w-5 text-blue-500" />
                Recurring Payments
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Toggle the <strong>Recurring</strong> option for regular payments</li>
                <li>Select frequency (weekly, biweekly, monthly, quarterly, or annually)</li>
                <li>System automatically creates new reminders based on schedule</li>
                <li>Edit any instance without affecting the series</li>
                <li>Delete entire series or just future occurrences</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Share2 className="mr-2 h-5 w-5 text-blue-500" />
                Sharing Payments
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Share payment reminders with family members or roommates</li>
                <li>Add participants by email to split bills</li>
                <li>Everyone receives notifications for shared payments</li>
                <li>Track who has paid their portion</li>
                <li>Send gentle reminders to those who haven't paid yet</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                AI Finance Buddy
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Chat with Finance Buddy for personalized payment advice</li>
                <li>Ask about optimizing payment schedules to improve cash flow</li>
                <li>Get suggestions for bill negotiation and potential savings</li>
                <li>Receive alerts about unusual payment patterns</li>
                <li>Ask for help creating or managing complex payment schedules</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-blue-500" />
                Achievements & Rewards
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Earn badges and achievements for good payment habits</li>
                <li>Track your payment streak for paying bills on time</li>
                <li>Unlock new Finance Buddy customization options</li>
                <li>Compete with friends on the leaderboard (optional)</li>
                <li>Use achievement points for theme customizations</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-blue-500" />
                Cash Flow Forecasting
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>View projected cash flow based on scheduled payments</li>
                <li>Get alerts for potential cash flow issues</li>
                <li>See recommended payment order to optimize your cash position</li>
                <li>Visualize income and expenses over time</li>
                <li>Adjust payment dates to improve your cash flow outlook</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-blue-500" />
                Managing Currency & Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-9 list-disc space-y-2 text-muted-foreground">
                <li>Select your preferred currency from the dropdown</li>
                <li>All payment amounts will be displayed in your selected currency</li>
                <li>Access more settings through the user menu</li>
                <li>Configure dark/light mode preferences</li>
                <li>Set up default notification preferences for all new payments</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
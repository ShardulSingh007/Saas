import React, { useState } from "react";
import { useTaxCalculator, Step } from "./TaxCalculatorProvider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  PlayCircleIcon, 
  DollarSign, 
  HandHelping, 
  PieChart, 
  FileText, 
  Save, 
  Download, 
  Lightbulb, 
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const { currentStep, goToStep } = useTaxCalculator();
  const [expandedItem, setExpandedItem] = useState<string>("getting-started");

  const handleAccordionChange = (value: string) => {
    setExpandedItem(value);
  };

  const sidebarItems = [
    {
      id: "getting-started",
      icon: <PlayCircleIcon className="tax-calculator-sidebar-item-icon" />,
      label: "Getting Started",
      step: null,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p>Start by selecting your country, tax year, and filing status to set the correct tax rules. The calculator adapts to specific tax laws and provides step-by-step guidance with every selection.</p>
          <p className="mt-2">The currency symbol will automatically update based on your country selection (e.g., ₹ for India, $ for US, etc.).</p>
          <p className="mt-2">Fill out each step of the form to receive an accurate tax estimate tailored to your specific financial situation.</p>
        </div>
      )
    },
    {
      id: "income-details",
      icon: <DollarSign className="tax-calculator-sidebar-item-icon" />,
      label: "Enter Income Details",
      step: Step.BasicInfo,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p><strong>Country Selection:</strong> Choose your country to apply country-specific tax rules and currency.</p>
          <p className="mt-2"><strong>Tax Year:</strong> Select the appropriate tax year (2021-2023).</p>
          <p className="mt-2"><strong>Filing Status:</strong> Options vary by country (Single, Married Filing Jointly, etc.).</p>
          <p className="mt-2"><strong>Income Sources:</strong> Enter your employment income, self-employment income, investments, and other income sources.</p>
          <p className="mt-2"><strong>Input Format:</strong> Enter numbers with or without currency symbols.</p>
        </div>
      )
    },
    {
      id: "deductions-credits",
      icon: <HandHelping className="tax-calculator-sidebar-item-icon" />,
      label: "Deductions & Credits",
      step: Step.Deductions,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p><strong>Deductions Step:</strong> Choose between standard or itemized deductions based on what saves you more money.</p>
          <p className="mt-2"><strong>Itemized Deductions:</strong> Enter mortgage interest, charitable donations, medical expenses, etc.</p>
          <p className="mt-2"><strong>Tax Credits Step:</strong> Enter qualifying children for child tax credit, education expenses, and other credits.</p>
          <p className="mt-2"><strong>Custom Entries:</strong> Add your own custom deductions and credits specific to your situation.</p>
        </div>
      )
    },
    {
      id: "results",
      icon: <PieChart className="tax-calculator-sidebar-item-icon" />,
      label: "Understanding Results",
      step: Step.Results,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p><strong>Tax Summary:</strong> View your total tax liability, effective tax rate, and refund/amount due.</p>
          <p className="mt-2"><strong>Tax Brackets:</strong> See which tax brackets your income falls into and how much is taxed at each rate.</p>
          <p className="mt-2"><strong>Breakdown Chart:</strong> Visual representation of your income, deductions, and taxes.</p>
          <p className="mt-2"><strong>Optimization Tips:</strong> Get personalized suggestions to potentially reduce your tax burden.</p>
        </div>
      )
    },
    {
      id: "what-if",
      icon: <FileText className="tax-calculator-sidebar-item-icon" />,
      label: "What-If Analysis",
      step: null,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p>Use the calculator to explore different scenarios:</p>
          <p className="mt-2">• How would a different filing status affect your taxes?</p>
          <p className="mt-2">• What if you contributed more to retirement accounts?</p>
          <p className="mt-2">• How would additional income sources change your tax bracket?</p>
          <p className="mt-2">Make changes to your inputs and see the results update in real-time to help with tax planning.</p>
        </div>
      )
    },
    {
      id: "saving",
      icon: <Save className="tax-calculator-sidebar-item-icon" />,
      label: "Saving & Privacy",
      step: null,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p><strong>Local Storage:</strong> Your data is saved automatically to your browser's local storage.</p>
          <p className="mt-2"><strong>Privacy:</strong> Your tax information never leaves your device unless you explicitly save it to our servers.</p>
          <p className="mt-2"><strong>Clear Data:</strong> You can clear all saved data at any time using the "Clear All Data" button.</p>
          <p className="mt-2"><strong>Data Recovery:</strong> Your data will be available when you return to the calculator on the same device and browser.</p>
        </div>
      )
    },
    {
      id: "export",
      icon: <Download className="tax-calculator-sidebar-item-icon" />,
      label: "Export Options",
      step: null,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p>You can export your tax calculation results in multiple formats:</p>
          <p className="mt-2">• PDF Report: Complete breakdown with charts and explanations</p>
          <p className="mt-2">• CSV: Raw data for spreadsheet analysis</p>
          <p className="mt-2">• Print: Printer-friendly version of your tax summary</p>
          <p className="mt-2">Use these exports for your records or to share with your tax professional.</p>
        </div>
      )
    },
    {
      id: "tax-tips",
      icon: <Lightbulb className="tax-calculator-sidebar-item-icon" />,
      label: "Tax Saving Tips",
      step: null,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p>Our calculator analyzes your specific situation and provides personalized tax-saving tips:</p>
          <p className="mt-2">• Retirement contribution opportunities</p>
          <p className="mt-2">• Education credit eligibility</p>
          <p className="mt-2">• Deduction optimization strategies</p>
          <p className="mt-2">• Filing status considerations</p>
          <p className="mt-2">These tips are generated based on your inputs and may help reduce your tax liability.</p>
        </div>
      )
    },
    {
      id: "help",
      icon: <HelpCircle className="tax-calculator-sidebar-item-icon" />,
      label: "FAQ/Help",
      step: null,
      content: (
        <div className="pl-11 pr-3 pb-3 text-muted-foreground text-sm">
          <p><strong>Q: Is this calculator accurate for my country?</strong></p>
          <p>A: We support tax calculations for multiple countries, with the most detailed rules for US, Canada, UK, Australia, and India.</p>
          
          <p className="mt-2"><strong>Q: Can I use this for official tax filing?</strong></p>
          <p>A: This tool is for estimation purposes only. Always consult a tax professional for official filings.</p>
          
          <p className="mt-2"><strong>Q: What if I make a mistake?</strong></p>
          <p>A: You can go back to any step using the navigation, or use "Clear All Data" to start over.</p>
          
          <p className="mt-2"><strong>Q: Will this work for complex tax situations?</strong></p>
          <p>A: The calculator covers most common scenarios, but very complex situations may require professional assistance.</p>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Guide</CardTitle>
        <CardDescription>How to use the tax calculator</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" value={expandedItem} onValueChange={handleAccordionChange} collapsible>
          {sidebarItems.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-0">
              <AccordionTrigger 
                className={`flex items-center ${item.step === currentStep ? 'font-bold text-primary' : ''}`} 
                onClick={() => item.step !== null && goToStep(item.step)}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-muted-foreground">
                  {item.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Sidebar;

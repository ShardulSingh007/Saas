import React from "react";
import { useTaxCalculator } from "../TaxCalculatorProvider";
import { formatCurrency, formatPercentage } from "@/lib/taxCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon, Download, Save, FileText, Lightbulb } from "lucide-react";
import { TaxBreakdownChart } from "../TaxBreakdownChart";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Results: React.FC = () => {
  const { 
    calculationResults,
    prevStep,
    country,
    taxYear,
    filingStatus,
    age,
    incomeData,
    deductionsData,
    creditsData,
    saveToLocalStorage
  } = useTaxCalculator();
  
  const { toast } = useToast();
  
  if (!calculationResults) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-medium mb-4">Error calculating results</h3>
        <p>Please go back and check your inputs.</p>
        <Button 
          className="mt-4" 
          onClick={prevStep}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    );
  }
  
  const handleSave = () => {
    saveToLocalStorage();
    toast({
      title: "Tax calculation saved",
      description: "Your tax calculation has been saved in your browser.",
    });
  };
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Tax Calculation Summary", 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add basic info
    doc.setFontSize(14);
    doc.text("Tax Information", 14, 40);
    
    const countryNames: Record<string, string> = {
      us: "United States",
      ca: "Canada",
      uk: "United Kingdom",
      au: "Australia"
    };
    
    const filingStatusNames: Record<string, string> = {
      single: "Single",
      mfj: "Married Filing Jointly",
      mfs: "Married Filing Separately",
      hoh: "Head of Household",
      married: "Married or Common-Law"
    };
    
    autoTable(doc, {
      startY: 45,
      head: [["Parameter", "Value"]],
      body: [
        ["Country", countryNames[country] || country],
        ["Tax Year", taxYear.toString()],
        ["Filing Status", filingStatusNames[filingStatus] || filingStatus],
        ["Age", age.toString()]
      ],
    });
    
    // Add summary
    doc.setFontSize(14);
    doc.text("Tax Calculation Summary", 14, doc.lastAutoTable.finalY + 10);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Item", "Amount"]],
      body: [
        ["Total Income", formatCurrency(calculationResults.totalIncome)],
        ["Adjusted Gross Income", formatCurrency(calculationResults.adjustedGrossIncome)],
        ["Total Deductions", formatCurrency(calculationResults.totalDeductions)],
        ["Taxable Income", formatCurrency(calculationResults.taxableIncome)],
        ["Federal Tax", formatCurrency(calculationResults.federalTax)],
        ["State Tax", formatCurrency(calculationResults.stateTax)],
        ["Self-Employment Tax", formatCurrency(calculationResults.selfEmploymentTax)],
        ["Total Tax", formatCurrency(calculationResults.totalTax)],
        ["Effective Tax Rate", formatPercentage(calculationResults.effectiveTaxRate)],
        ["Take Home Pay (Annual)", formatCurrency(calculationResults.takeHomePay)],
        ["Take Home Pay (Monthly)", formatCurrency(calculationResults.takeHomePay / 12)]
      ],
    });
    
    // Add tax bracket breakdown
    doc.setFontSize(14);
    doc.text("Tax Bracket Breakdown", 14, doc.lastAutoTable.finalY + 10);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Income Bracket", "Rate", "Tax Amount"]],
      body: calculationResults.taxBrackets.map(bracket => [
        `${formatCurrency(bracket.min)} - ${bracket.max ? formatCurrency(bracket.max) : "∞"}`,
        formatPercentage(bracket.rate * 100),
        formatCurrency(bracket.tax)
      ]),
    });
    
    // Save the PDF
    doc.save(`tax_calculation_${taxYear}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Your tax calculation PDF has been downloaded.",
    });
  };
  
  const generateText = () => {
    // Create a text summary
    let text = "TAX CALCULATION SUMMARY\n\n";
    text += `Date: ${new Date().toLocaleDateString()}\n\n`;
    text += "TAX INFORMATION\n";
    
    const countryNames: Record<string, string> = {
      us: "United States",
      ca: "Canada",
      uk: "United Kingdom",
      au: "Australia"
    };
    
    const filingStatusNames: Record<string, string> = {
      single: "Single",
      mfj: "Married Filing Jointly",
      mfs: "Married Filing Separately",
      hoh: "Head of Household",
      married: "Married or Common-Law"
    };
    
    text += `Country: ${countryNames[country] || country}\n`;
    text += `Tax Year: ${taxYear}\n`;
    text += `Filing Status: ${filingStatusNames[filingStatus] || filingStatus}\n`;
    text += `Age: ${age}\n\n`;
    
    text += "TAX CALCULATION SUMMARY\n";
    text += `Total Income: ${formatCurrency(calculationResults.totalIncome)}\n`;
    text += `Adjusted Gross Income: ${formatCurrency(calculationResults.adjustedGrossIncome)}\n`;
    text += `Total Deductions: ${formatCurrency(calculationResults.totalDeductions)}\n`;
    text += `Taxable Income: ${formatCurrency(calculationResults.taxableIncome)}\n`;
    text += `Federal Tax: ${formatCurrency(calculationResults.federalTax)}\n`;
    text += `State Tax: ${formatCurrency(calculationResults.stateTax)}\n`;
    text += `Self-Employment Tax: ${formatCurrency(calculationResults.selfEmploymentTax)}\n`;
    text += `Total Tax: ${formatCurrency(calculationResults.totalTax)}\n`;
    text += `Effective Tax Rate: ${formatPercentage(calculationResults.effectiveTaxRate)}\n`;
    text += `Take Home Pay (Annual): ${formatCurrency(calculationResults.takeHomePay)}\n`;
    text += `Take Home Pay (Monthly): ${formatCurrency(calculationResults.takeHomePay / 12)}\n\n`;
    
    text += "TAX BRACKET BREAKDOWN\n";
    calculationResults.taxBrackets.forEach(bracket => {
      text += `${formatCurrency(bracket.min)} - ${bracket.max ? formatCurrency(bracket.max) : "∞"}: ${formatPercentage(bracket.rate * 100)} -> ${formatCurrency(bracket.tax)}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `tax_calculation_${taxYear}.txt`;
    link.href = url;
    link.click();
    
    toast({
      title: "Text File Generated",
      description: "Your tax calculation text file has been downloaded.",
    });
  };
  
  return (
    <div className="bg-background p-5 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Tax Calculation Results</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="text-md font-medium mb-4">Summary</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Income:</span>
                <span className="font-medium">{formatCurrency(calculationResults.totalIncome)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adjusted Gross Income:</span>
                <span className="font-medium">{formatCurrency(calculationResults.adjustedGrossIncome)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Deductions:</span>
                <span className="font-medium">{formatCurrency(calculationResults.totalDeductions)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxable Income:</span>
                <span className="font-medium">{formatCurrency(calculationResults.taxableIncome)}</span>
              </div>
              
              <hr className="border-border" />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Federal Tax:</span>
                <span className="font-medium">{formatCurrency(calculationResults.federalTax)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">State Tax:</span>
                <span className="font-medium">{formatCurrency(calculationResults.stateTax)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Self-Employment Tax:</span>
                <span className="font-medium">{formatCurrency(calculationResults.selfEmploymentTax)}</span>
              </div>
              
              <hr className="border-border" />
              
              <div className="flex justify-between text-lg">
                <span className="font-medium">Total Tax:</span>
                <span className="font-bold">{formatCurrency(calculationResults.totalTax)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective Tax Rate:</span>
                <span className="font-medium">{formatPercentage(calculationResults.effectiveTaxRate)}</span>
              </div>
              
              <hr className="border-border" />
              
              <div className="flex justify-between text-lg">
                <span className="font-medium">Take Home Pay (Annual):</span>
                <span className="font-bold text-green-500">{formatCurrency(calculationResults.takeHomePay)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly:</span>
                <span className="font-medium">{formatCurrency(calculationResults.takeHomePay / 12)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h4 className="text-md font-medium mb-4">Tax Breakdown</h4>
            <div className="h-64">
              <TaxBreakdownChart calculationResults={calculationResults} />
            </div>
            
            {calculationResults.taxSavingsTips && calculationResults.taxSavingsTips.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Potential Tax Savings</h4>
                {calculationResults.taxSavingsTips.map((tip, index) => (
                  <div key={index} className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3 mb-2">
                    <div className="flex">
                      <div className="mr-3 text-blue-400">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-300">{tip.description}</p>
                        <p className="text-xs text-blue-400 mt-1">Savings: {formatCurrency(tip.savings)}/yr</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-background rounded-lg mb-6">
        <h4 className="text-md font-medium mb-4">Export Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="w-full" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Calculation
          </Button>
          
          <Button variant="outline" className="w-full" onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
          
          <Button variant="outline" className="w-full" onClick={generateText}>
            <FileText className="mr-2 h-4 w-4" />
            Download as Text
          </Button>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={prevStep}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Credits
        </Button>
      </div>
    </div>
  );
};

export default Results;

import React from "react";
import { useTaxCalculator } from "./TaxCalculatorProvider";
import { formatCurrency, formatPercentage } from "@/lib/taxCalculator";
import { TaxBreakdownChart } from "./TaxBreakdownChart";
import { TaxBrackets } from "./TaxBrackets";

const TaxEstimation: React.FC = () => {
  const { calculationResults } = useTaxCalculator();
  
  if (!calculationResults) {
    return null;
  }
  
  const {
    totalIncome,
    totalTax,
    federalTax,
    stateTax,
    selfEmploymentTax,
    effectiveTaxRate,
    takeHomePay,
    taxBrackets,
    taxSavingsTips
  } = calculationResults;
  
  const isUpdated = true; // In a real app, this would track when the calculation was last updated

  return (
    <div className="bg-muted rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Live Tax Estimation</h2>
        {isUpdated && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Updated now</span>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-5">Your estimates are based on current inputs:</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary Section */}
        <div className="lg:col-span-2 bg-background rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-muted-foreground text-sm mb-1">Total Income</div>
              <div className="text-foreground text-xl font-semibold">{formatCurrency(totalIncome)}</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-muted-foreground text-sm mb-1">Total Tax</div>
              <div className="text-foreground text-xl font-semibold">{formatCurrency(totalTax)}</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-muted-foreground text-sm mb-1">Remaining</div>
              <div className="text-foreground text-xl font-semibold">{formatCurrency(takeHomePay)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Federal Income Tax</p>
              <p className="text-foreground font-medium">{formatCurrency(federalTax)}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-sm">State Income Tax</p>
              <p className="text-foreground font-medium">{formatCurrency(stateTax)}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-sm">Self-Employment Tax</p>
              <p className="text-foreground font-medium">{formatCurrency(selfEmploymentTax)}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground text-sm">Effective Tax Rate</p>
              <p className="text-foreground font-medium">{formatPercentage(effectiveTaxRate)}</p>
            </div>
          </div>
          
          <div className="border-t border-border mt-4 pt-4">
            <div className="flex justify-between">
              <p className="text-foreground font-medium">Take Home Pay (Annual)</p>
              <p className="text-foreground font-semibold">{formatCurrency(takeHomePay)}</p>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <p className="text-muted-foreground">Monthly</p>
              <p className="text-foreground">{formatCurrency(takeHomePay / 12)}</p>
            </div>
          </div>
        </div>
        
        {/* Tax Brackets */}
        <div className="bg-background rounded-lg p-4">
          <TaxBrackets taxBrackets={taxBrackets} />
          
          {taxSavingsTips && taxSavingsTips.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Potential Tax Savings</h4>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3">
                <div className="flex">
                  <div className="mr-3 text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb">
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                      <path d="M9 18h6"/>
                      <path d="M10 22h4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">{taxSavingsTips[0].description}</p>
                    <p className="text-xs text-blue-400 mt-1">Savings: {formatCurrency(taxSavingsTips[0].savings)}/yr</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tax Breakdown Chart */}
      <div className="mt-6">
        <div className="bg-background p-4 rounded-lg h-64">
          <TaxBreakdownChart calculationResults={calculationResults} />
        </div>
      </div>
    </div>
  );
};

export default TaxEstimation;

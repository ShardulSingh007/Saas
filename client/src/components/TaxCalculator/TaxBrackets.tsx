import React from "react";
import { formatCurrency, formatPercentage } from "@/lib/taxCalculator";
import { CalculationResults } from "@shared/schema";

interface TaxBracketsProps {
  taxBrackets: CalculationResults['taxBrackets'];
}

export const TaxBrackets: React.FC<TaxBracketsProps> = ({ taxBrackets }) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-3">Progressive Tax Brackets</h3>
      
      <div className="space-y-2">
        <div>
          <div className="tax-bracket-header">
            <span>Income Bracket</span>
            <span>Rate</span>
            <span>Tax</span>
          </div>
          
          {taxBrackets.map((bracket, index) => (
            <div key={index} className="tax-bracket-row">
              <span>
                {formatCurrency(bracket.min)} - {bracket.max ? formatCurrency(bracket.max) : "∞"}
              </span>
              <span>{formatPercentage(bracket.rate * 100)}</span>
              <span>{formatCurrency(bracket.tax)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useTaxCalculator } from "../TaxCalculatorProvider";
import { formatCurrency } from "@/lib/taxCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, ArrowRightIcon, ArrowLeftIcon, XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Credits: React.FC = () => {
  const { 
    creditsData,
    updateChildTaxCredit,
    toggleEarnedIncome,
    updateEducationTuition,
    addOtherCredit,
    removeOtherCredit,
    nextStep,
    prevStep,
    saveToLocalStorage,
    calculationResults,
    formatCurrencyWithCountry
  } = useTaxCalculator();

  const [otherCreditName, setOtherCreditName] = useState("");
  const [otherCreditAmount, setOtherCreditAmount] = useState("0.00");
  const [showAddCredit, setShowAddCredit] = useState(false);

  const handleAddOtherCredit = () => {
    addOtherCredit(otherCreditName, otherCreditAmount);
    setOtherCreditName("");
    setOtherCreditAmount("0.00");
    setShowAddCredit(false);
  };

  const handleContinue = () => {
    saveToLocalStorage();
    nextStep();
  };

  return (
    <div className="bg-background p-5 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Tax Credits</h3>
      
      <div className="space-y-6">
        {/* Child Tax Credit */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Child Tax Credit</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Number of Qualifying Children</Label>
              <Input 
                type="number" 
                min="0"
                value={creditsData.childTaxCredit.qualifying}
                onChange={(e) => updateChildTaxCredit(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-muted-foreground">
                Estimated Credit: {formatCurrencyWithCountry(calculationResults?.childTaxCredit || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Earned Income Credit */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Earned Income Credit</h4>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="earnedIncome" 
              checked={creditsData.earnedIncome}
              onCheckedChange={(checked) => toggleEarnedIncome(checked as boolean)}
            />
            <Label htmlFor="earnedIncome" className="cursor-pointer">
              Qualify for Earned Income Credit
            </Label>
          </div>
          {creditsData.earnedIncome && (
            <div className="text-sm text-muted-foreground">
              Estimated Credit: {formatCurrencyWithCountry(calculationResults?.earnedIncomeCredit || 0)}
            </div>
          )}
        </div>

        {/* Education Credits */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Education Credits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tuition and Fees</Label>
              <div className="money-input-wrapper">
                <Input 
                  type="text" 
                  value={formatCurrencyWithCountry(creditsData.education.tuition).replace(/[^\d.,]/g, '')}
                  onChange={(e) => updateEducationTuition(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-muted-foreground">
                Estimated Credit: {formatCurrencyWithCountry(calculationResults?.educationCredit || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Other Credits */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Other Credits</h4>
          {creditsData.other.map((credit, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <Label>{credit.name}</Label>
                <div className="money-input-wrapper">
                  <Input 
                    type="text" 
                    value={formatCurrencyWithCountry(credit.amount).replace(/[^\d.,]/g, '')}
                    onChange={(e) => updateOtherCredit(index, credit.name, e.target.value)}
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeOtherCredit(index)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            onClick={() => setShowAddCredit(true)}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Other Credit
          </Button>
        </div>

        {/* Summary */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="text-md font-medium mb-2">Credit Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Credits:</span>
              <span className="font-semibold">{formatCurrencyWithCountry(calculationResults?.totalCredits || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={prevStep}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Deductions
        </Button>
        
        <Button 
          className="bg-primary" 
          onClick={handleContinue}
        >
          Continue to Results
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Credits;

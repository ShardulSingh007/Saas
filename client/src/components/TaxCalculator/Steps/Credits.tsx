import React, { useState } from "react";
import { useTaxCalculator } from "../TaxCalculatorProvider";
import { formatCurrency } from "@/lib/taxCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, ArrowRightIcon, ArrowLeftIcon, XIcon } from "lucide-react";

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
    saveToLocalStorage
  } = useTaxCalculator();

  const [otherCreditName, setOtherCreditName] = useState("");
  const [otherCreditAmount, setOtherCreditAmount] = useState("0.00");

  const handleAddOtherCredit = () => {
    addOtherCredit(otherCreditName, otherCreditAmount);
    setOtherCreditName("");
    setOtherCreditAmount("0.00");
  };

  const handleContinue = () => {
    saveToLocalStorage();
    nextStep();
  };

  return (
    <div className="bg-background p-5 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Tax Credits</h3>
      
      {/* Child Tax Credit */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-foreground mb-3">Child Tax Credit</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Number of Qualifying Children</Label>
            <Input 
              type="number" 
              className="bg-muted" 
              value={creditsData.childTaxCredit.qualifying} 
              onChange={(e) => updateChildTaxCredit(e.target.value)} 
              min={0}
              max={10}
            />
          </div>
        </div>
      </div>
      
      {/* Earned Income Credit */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-foreground mb-3">Earned Income Credit</h4>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={creditsData.earnedIncome} 
            onCheckedChange={toggleEarnedIncome} 
            id="earned-income"
          />
          <Label htmlFor="earned-income">I qualify for the Earned Income Tax Credit</Label>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          The Earned Income Tax Credit benefits low to moderate income workers and families.
        </p>
      </div>
      
      {/* Education Credits */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-foreground mb-3">Education Credits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Qualified Education Expenses</Label>
            <div className="money-input-wrapper">
              <span>$</span>
              <Input 
                type="text" 
                className="bg-muted" 
                value={formatCurrency(creditsData.education.tuition).replace('$', '')} 
                onChange={(e) => updateEducationTuition(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Includes tuition and required fees for higher education
            </p>
          </div>
        </div>
      </div>
      
      {/* Other Credits List */}
      {creditsData.other.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-foreground mb-3">Other Tax Credits</h4>
          {creditsData.other.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="font-medium">{item.name}</div>
                <div>{formatCurrency(item.amount)}</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2" 
                onClick={() => removeOtherCredit(index)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Other Credit */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-foreground mb-3">Add Other Tax Credit</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input 
              type="text" 
              placeholder="E.g. Residential Energy Credit" 
              className="bg-muted" 
              value={otherCreditName}
              onChange={(e) => setOtherCreditName(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Label className="mr-2">Amount</Label>
            <div className="money-input-wrapper flex-1">
              <span>$</span>
              <Input 
                type="text" 
                className="bg-muted" 
                value={otherCreditAmount} 
                onChange={(e) => setOtherCreditAmount(e.target.value)}
              />
            </div>
            <Button 
              className="ml-2 bg-primary" 
              onClick={handleAddOtherCredit}
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              <span>Add Credit</span>
            </Button>
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
          View Results
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Credits;

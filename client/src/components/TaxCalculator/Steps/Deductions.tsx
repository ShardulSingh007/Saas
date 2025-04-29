import React, { useState } from "react";
import { useTaxCalculator } from "../TaxCalculatorProvider";
import { formatCurrency } from "@/lib/taxCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusIcon, ArrowRightIcon, ArrowLeftIcon, XIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Deductions: React.FC = () => {
  const { 
    deductionsData,
    toggleDeductionType,
    updateItemizedDeduction,
    addOtherDeduction,
    removeOtherDeduction,
    nextStep,
    prevStep,
    saveToLocalStorage,
    calculationResults
  } = useTaxCalculator();

  const [otherDeductionName, setOtherDeductionName] = useState("");
  const [otherDeductionAmount, setOtherDeductionAmount] = useState("0.00");

  const handleAddOtherDeduction = () => {
    addOtherDeduction(otherDeductionName, otherDeductionAmount);
    setOtherDeductionName("");
    setOtherDeductionAmount("0.00");
  };

  const handleContinue = () => {
    saveToLocalStorage();
    nextStep();
  };

  return (
    <div className="bg-background p-5 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Deductions</h3>
      
      <div className="mb-6">
        <Label className="mb-3 block">Choose Deduction Method</Label>
        <RadioGroup 
          defaultValue={deductionsData.standard ? "standard" : "itemized"}
          onValueChange={(value) => toggleDeductionType(value === "standard")}
          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="cursor-pointer">
              Standard Deduction ({formatCurrency(calculationResults?.totalDeductions || 0)})
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="itemized" id="itemized" />
            <Label htmlFor="itemized" className="cursor-pointer">Itemized Deduction</Label>
          </div>
        </RadioGroup>
      </div>
      
      {!deductionsData.standard && (
        <div className="mb-6">
          <Tabs defaultValue="common" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="common">Common Deductions</TabsTrigger>
              <TabsTrigger value="other">Other Deductions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="common" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Mortgage Interest</Label>
                  <div className="money-input-wrapper">
                    <span>$</span>
                    <Input 
                      type="text" 
                      className="bg-muted" 
                      value={formatCurrency(deductionsData.itemized.mortgage).replace('$', '')} 
                      onChange={(e) => updateItemizedDeduction('mortgage', e.target.value)} 
                    />
                  </div>
                </div>
                
                <div>
                  <Label>State and Local Taxes</Label>
                  <div className="money-input-wrapper">
                    <span>$</span>
                    <Input 
                      type="text" 
                      className="bg-muted" 
                      value={formatCurrency(deductionsData.itemized.stateTaxes).replace('$', '')} 
                      onChange={(e) => updateItemizedDeduction('stateTaxes', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Charitable Donations</Label>
                  <div className="money-input-wrapper">
                    <span>$</span>
                    <Input 
                      type="text" 
                      className="bg-muted" 
                      value={formatCurrency(deductionsData.itemized.charitableDonations).replace('$', '')} 
                      onChange={(e) => updateItemizedDeduction('charitableDonations', e.target.value)} 
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Medical Expenses</Label>
                  <div className="money-input-wrapper">
                    <span>$</span>
                    <Input 
                      type="text" 
                      className="bg-muted" 
                      value={formatCurrency(deductionsData.itemized.medicalExpenses).replace('$', '')} 
                      onChange={(e) => updateItemizedDeduction('medicalExpenses', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Student Loan Interest</Label>
                  <div className="money-input-wrapper">
                    <span>$</span>
                    <Input 
                      type="text" 
                      className="bg-muted" 
                      value={formatCurrency(deductionsData.itemized.studentLoanInterest).replace('$', '')} 
                      onChange={(e) => updateItemizedDeduction('studentLoanInterest', e.target.value)} 
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Retirement Contributions</Label>
                  <div className="money-input-wrapper">
                    <span>$</span>
                    <Input 
                      type="text" 
                      className="bg-muted" 
                      value={formatCurrency(deductionsData.itemized.retirement).replace('$', '')} 
                      onChange={(e) => updateItemizedDeduction('retirement', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="other" className="mt-4">
              {/* Other Deductions List */}
              {deductionsData.itemized.other.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-foreground mb-3">Added Deductions</h4>
                  {deductionsData.itemized.other.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="font-medium">{item.name}</div>
                        <div>{formatCurrency(item.amount)}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2" 
                        onClick={() => removeOtherDeduction(index)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Other Deduction */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-foreground mb-3">Add Deduction</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input 
                      type="text" 
                      placeholder="E.g. Home Office Expenses" 
                      className="bg-muted" 
                      value={otherDeductionName}
                      onChange={(e) => setOtherDeductionName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Label className="mr-2">Amount</Label>
                    <div className="money-input-wrapper flex-1">
                      <span>$</span>
                      <Input 
                        type="text" 
                        className="bg-muted" 
                        value={otherDeductionAmount} 
                        onChange={(e) => setOtherDeductionAmount(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="ml-2 bg-primary" 
                      onClick={handleAddOtherDeduction}
                    >
                      <PlusIcon className="mr-1 h-4 w-4" />
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Summary */}
      <div className="bg-muted p-4 rounded-lg mb-6">
        <h4 className="text-md font-medium mb-2">Deduction Summary</h4>
        <div className="flex justify-between">
          <span>Total Deductions:</span>
          <span className="font-semibold">{formatCurrency(calculationResults?.totalDeductions || 0)}</span>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={prevStep}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Income
        </Button>
        
        <Button 
          className="bg-primary" 
          onClick={handleContinue}
        >
          Continue to Credits
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Deductions;

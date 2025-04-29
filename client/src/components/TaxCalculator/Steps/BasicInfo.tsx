import React, { useState, useMemo } from "react";
import { useTaxCalculator } from "../TaxCalculatorProvider";
import { countries, taxYears, filingStatuses, FilingStatus } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusIcon, ArrowRightIcon, XIcon } from "lucide-react";

const BasicInfo: React.FC = () => {
  const { 
    country, 
    setCountry,
    taxYear, 
    setTaxYear,
    filingStatus, 
    setFilingStatus,
    age, 
    setAge,
    incomeData,
    updateSalary,
    updateTaxWithheld,
    updateBusinessIncome,
    updateBusinessExpenses,
    updateDividends,
    updateCapitalGains,
    addOtherIncome,
    removeOtherIncome,
    nextStep,
    saveToLocalStorage,
    formatCurrencyWithCountry
  } = useTaxCalculator();

  const [otherIncomeName, setOtherIncomeName] = useState("");
  const [otherIncomeAmount, setOtherIncomeAmount] = useState("0.00");

  // Get currency symbol for the country
  const currencySymbol = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: country === 'us' ? 'USD' : 
               country === 'ca' ? 'CAD' : 
               country === 'uk' ? 'GBP' : 
               country === 'in' ? 'INR' : 
               country === 'au' ? 'AUD' : 
               country === 'eu' ? 'EUR' : 'USD'
    });
    return formatter.format(0).replace(/[\d.,]/g, '');
  }, [country]);

  const handleAddOtherIncome = () => {
    addOtherIncome(otherIncomeName, otherIncomeAmount);
    setOtherIncomeName("");
    setOtherIncomeAmount("0.00");
  };

  const handleContinue = () => {
    saveToLocalStorage();
    nextStep();
  };

  // Function to format displayed values in inputs
  const formatInputValue = (value: number) => {
    const formatted = formatCurrencyWithCountry(value);
    return formatted.replace(/[^\d.,]/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="bg-background p-5 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4">Income Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="country">Country</Label>
            <Select 
              value={country} 
              onValueChange={setCountry}
            >
              <SelectTrigger className="w-full bg-muted">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="taxYear">Tax Year</Label>
            <Select 
              value={taxYear.toString()} 
              onValueChange={(value) => setTaxYear(parseInt(value, 10))}
            >
              <SelectTrigger className="w-full bg-muted">
                <SelectValue placeholder="Select tax year" />
              </SelectTrigger>
              <SelectContent>
                {taxYears.map(y => (
                  <SelectItem key={y.id} value={y.id.toString()}>{y.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="filingStatus">Filing Status</Label>
            <Select 
              value={filingStatus} 
              onValueChange={setFilingStatus}
            >
              <SelectTrigger className="w-full bg-muted">
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                {(filingStatuses[country] || filingStatuses.default).map((status: FilingStatus) => (
                  <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="age">Your Age</Label>
            <Input 
              type="number" 
              id="age" 
              className="bg-muted" 
              value={age} 
              onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)} 
              min={0}
              max={120}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-background p-5 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-4">Income Sources</h3>
        
        {/* Employment Income */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-foreground mb-3">Employment Income</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Salary/Wages</Label>
              <div className="money-input-wrapper">
                <span>{currencySymbol}</span>
                <Input 
                  type="text"
                  className="bg-muted" 
                  value={formatInputValue(incomeData.employment.salary)} 
                  onChange={(e) => updateSalary(e.target.value)} 
                />
              </div>
            </div>
            
            <div>
              <Label>Tax Withheld</Label>
              <div className="money-input-wrapper">
                <span>{currencySymbol}</span>
                <Input 
                  type="text" 
                  className="bg-muted" 
                  value={formatInputValue(incomeData.employment.withheld)} 
                  onChange={(e) => updateTaxWithheld(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Self-Employment Income */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-foreground mb-3">Self-Employment Income</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Business Income</Label>
              <div className="money-input-wrapper">
                <span>{currencySymbol}</span>
                <Input 
                  type="text" 
                  className="bg-muted" 
                  value={formatInputValue(incomeData.selfEmployment.business)} 
                  onChange={(e) => updateBusinessIncome(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Business Expenses</Label>
              <div className="money-input-wrapper">
                <span>{currencySymbol}</span>
                <Input 
                  type="text" 
                  className="bg-muted" 
                  value={formatInputValue(incomeData.selfEmployment.expenses)} 
                  onChange={(e) => updateBusinessExpenses(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Investment Income */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-foreground mb-3">Investment Income</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Dividends</Label>
              <div className="money-input-wrapper">
                <span>{currencySymbol}</span>
                <Input 
                  type="text" 
                  className="bg-muted" 
                  value={formatInputValue(incomeData.investment.dividends)} 
                  onChange={(e) => updateDividends(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Capital Gains</Label>
              <div className="money-input-wrapper">
                <span>{currencySymbol}</span>
                <Input 
                  type="text" 
                  className="bg-muted" 
                  value={formatInputValue(incomeData.investment.capitalGains)}
                  onChange={(e) => updateCapitalGains(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Other Income Sources */}
        {incomeData.other.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-foreground mb-3">Other Income Sources</h4>
            {incomeData.other.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="font-medium">{item.name}</div>
                  <div>{formatCurrencyWithCountry(item.amount)}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2" 
                  onClick={() => removeOtherIncome(index)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add Other Income */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-foreground mb-3">Add Income Source</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input 
                type="text" 
                placeholder="E.g. Rental Income" 
                className="bg-muted" 
                value={otherIncomeName}
                onChange={(e) => setOtherIncomeName(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <Label className="mr-2">Amount</Label>
              <div className="money-input-wrapper flex-1">
                <span>{currencySymbol}</span>
                <Input 
                  type="text" 
                  className="bg-muted" 
                  value={otherIncomeAmount} 
                  onChange={(e) => setOtherIncomeAmount(e.target.value)}
                />
              </div>
              <Button 
                className="ml-2 bg-primary" 
                onClick={handleAddOtherIncome}
              >
                <PlusIcon className="mr-1 h-4 w-4" />
                <span>Add Income Source</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-end mt-6">
          <Button 
            className="bg-primary" 
            onClick={handleContinue}
          >
            Continue to Deductions
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

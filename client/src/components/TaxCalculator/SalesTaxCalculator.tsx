
import React, { useState, useEffect } from "react";
import { useTaxCalculator } from "./TaxCalculatorProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Percent, DollarSign, Coins, RefreshCw, Save, Calculator } from "lucide-react";
import { parseCurrencyInput } from "@/lib/taxCalculator";
import type { SalesTaxCalculation } from "@shared/schema";

const SalesTaxCalculator: React.FC = () => {
  const { formatCurrencyWithCountry } = useTaxCalculator();
  const [activeTab, setActiveTab] = useState('sales-tax');
  
  const [salesTaxCalc, setSalesTaxCalc] = useState<SalesTaxCalculation>({
    amount: 0,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 0
  });
  
  const [savedCalculations, setSavedCalculations] = useState<SalesTaxCalculation[]>([]);
  
  useEffect(() => {
    calculateSalesTax();
  }, [salesTaxCalc.amount, salesTaxCalc.taxRate]);
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem('salesTaxCalculations');
      if (saved) {
        setSavedCalculations(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading saved sales tax calculations:", error);
    }
  }, []);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalesTaxCalc(prev => ({
      ...prev,
      amount: parseCurrencyInput(e.target.value)
    }));
  };
  
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalesTaxCalc(prev => ({
      ...prev,
      taxRate: parseFloat(e.target.value) || 0
    }));
  };
  
  const calculateSalesTax = () => {
    const { amount, taxRate } = salesTaxCalc;
    const taxAmount = amount * (taxRate / 100);
    const totalAmount = amount + taxAmount;
    
    setSalesTaxCalc(prev => ({
      ...prev,
      taxAmount,
      totalAmount
    }));
  };
  
  const resetForm = () => {
    setSalesTaxCalc({
      amount: 0,
      taxRate: 0,
      taxAmount: 0,
      totalAmount: 0
    });
  };
  
  const saveCalculation = () => {
    const newSavedCalculations = [
      ...savedCalculations, 
      { ...salesTaxCalc }
    ].slice(-10);
    
    setSavedCalculations(newSavedCalculations);
    
    try {
      localStorage.setItem('salesTaxCalculations', JSON.stringify(newSavedCalculations));
    } catch (error) {
      console.error("Error saving sales tax calculations:", error);
    }
  };
  
  const clearSavedCalculations = () => {
    setSavedCalculations([]);
    try {
      localStorage.removeItem('salesTaxCalculations');
    } catch (error) {
      console.error("Error clearing saved sales tax calculations:", error);
    }
  };
  
  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <CardHeader className="space-y-1.5 pb-6">
        <CardTitle className="flex items-center text-2xl">
          <Calculator className="mr-2 h-6 w-6 text-primary" />
          Sales Tax / VAT Calculator
        </CardTitle>
        <CardDescription className="text-base space-y-2">
          <p>Calculate sales tax or value-added tax (VAT) on purchases and services. Sales tax is a consumption tax imposed by governments on the sale of goods and services. VAT is a similar tax that is collected at each stage of production and distribution.</p>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <p className="font-medium text-sm">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
              <li>Enter the amount before tax in the "Amount Before Tax" field</li>
              <li>Input the tax rate percentage in the "Tax Rate (%)" field</li>
              <li>The calculator will automatically show the tax amount and total</li>
              <li>Use the "Save Calculation" button to store results for reference</li>
              <li>View saved calculations in the History tab</li>
            </ol>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales-tax" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sales-tax" className="text-sm">Calculator</TabsTrigger>
            <TabsTrigger value="history" className="text-sm">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales-tax" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium">Amount Before Tax</Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="amount"
                      placeholder="0.00"
                      className="pl-10"
                      value={salesTaxCalc.amount === 0 ? "" : salesTaxCalc.amount.toString()}
                      onChange={handleAmountChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tax-rate" className="text-sm font-medium">Tax Rate (%)</Label>
                  <div className="relative mt-1.5">
                    <Percent className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="tax-rate"
                      placeholder="0.00"
                      className="pl-10"
                      value={salesTaxCalc.taxRate === 0 ? "" : salesTaxCalc.taxRate.toString()}
                      onChange={handleTaxRateChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-muted/30 border p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Tax Amount:</div>
                    <div className="text-2xl font-semibold text-primary">
                      {formatCurrencyWithCountry(salesTaxCalc.taxAmount)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Total Amount:</div>
                    <div className="text-2xl font-semibold">
                      {formatCurrencyWithCountry(salesTaxCalc.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={resetForm} className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              
              <Button onClick={saveCalculation} disabled={salesTaxCalc.amount === 0} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Calculation
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {savedCalculations.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {savedCalculations.slice().reverse().map((calc, index) => (
                    <div key={index} className="rounded-lg bg-card border p-4 hover:bg-accent/5 transition-colors">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Amount:</div>
                          <div className="font-medium">{formatCurrencyWithCountry(calc.amount)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Tax Rate:</div>
                          <div className="font-medium">{calc.taxRate.toFixed(2)}%</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Tax:</div>
                          <div className="font-medium text-primary">{formatCurrencyWithCountry(calc.taxAmount)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Total:</div>
                          <div className="font-medium">{formatCurrencyWithCountry(calc.totalAmount)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={clearSavedCalculations}
                  className="w-full mt-4"
                >
                  Clear History
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="mb-2">No saved calculations yet.</div>
                <div className="text-sm">Save a calculation to see it here.</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesTaxCalculator;

import React, { useState } from "react";
import { useTaxCalculator } from "../TaxCalculatorProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CountrySelector from "../CountrySelector";
import { Button } from "@/components/ui/button";
import { XIcon } from 'lucide-react';
import clsx from 'clsx';

const TAX_YEARS = [2024, 2023, 2022, 2021, 2020];
const FILING_STATUSES = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married Filing Jointly" },
  { value: "head", label: "Head of Household" },
];

const BasicInfo: React.FC = () => {
  const {
    basicInfoData = { year: TAX_YEARS[0], filingStatus: "single", age: 30, incomeSources: [] },
    updateBasicInfo,
    currencyInfo,
    nextStep
  } = useTaxCalculator();

  const [newSourceLabel, setNewSourceLabel] = useState("");
  const [newSourceAmount, setNewSourceAmount] = useState("");
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const incomeSources = basicInfoData.incomeSources || [];

  // Validation helpers
  const isInvalid = (value: number) => value === null || value === undefined || isNaN(value) || value < 0;
  const isEmpty = (value: number) => value === null || value === undefined;

  // Required fields: Salary/Wages, Tax Withheld, Business Income, Business Expense, Dividends, Capital Gains
  const requiredFields = incomeSources.slice(0, 6);
  const allValid = requiredFields.every(src => !isInvalid(src.value));

  // Live summary
  const totalGrossIncome = incomeSources.reduce((sum, src) => sum + (isInvalid(src.value) ? 0 : src.value), 0);
  // Fields Filled logic: X = number of numeric income fields (standard + custom) that are non-empty and non-zero
  // Y = total number of income input fields shown
  const filledFields = incomeSources.filter(src => src.value !== null && src.value !== undefined && src.value !== 0 && !isNaN(src.value)).length;
  const totalFields = incomeSources.length;

  // Handlers
  const handleIncomeChange = (idx: number, value: string) => {
    const updated = [...incomeSources];
    updated[idx].value = parseFloat(value) || 0;
    updateBasicInfo({ incomeSources: updated });
    setTouched(t => ({ ...t, [idx]: true }));
  };
  const handleAddIncomeSource = () => {
    if (newSourceLabel && newSourceAmount && !isInvalid(parseFloat(newSourceAmount))) {
      updateBasicInfo({ incomeSources: [...incomeSources, { label: newSourceLabel, value: parseFloat(newSourceAmount) || 0 }] });
      setNewSourceLabel("");
      setNewSourceAmount("");
    }
  };
  const handleRemoveCustomSource = (idx: number) => {
    if (idx > 5) {
      const updated = incomeSources.filter((_, i) => i !== idx);
      updateBasicInfo({ incomeSources: updated });
    }
  };
  const handleContinue = () => {
    if (allValid) nextStep();
  };

  return (
    <div className="bg-background p-6 rounded-lg mb-8 shadow-md">
      {/* Section Header */}
      <h3 className="text-xl font-semibold mb-6">Income Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Country */}
        <div>
          <Label htmlFor="country">Country</Label>
          <CountrySelector />
        </div>
        {/* Tax Year */}
        <div>
          <Label htmlFor="taxYear">Tax Year</Label>
          <select
            id="taxYear"
            className="w-full p-2 border rounded-md bg-muted text-foreground"
            value={basicInfoData.year}
            onChange={e => updateBasicInfo({ year: parseInt(e.target.value) })}
          >
            {TAX_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        {/* Filing Status */}
        <div>
          <Label htmlFor="filingStatus">Filing Status</Label>
          <select
            id="filingStatus"
            className="w-full p-2 border rounded-md bg-muted text-foreground"
            value={basicInfoData.filingStatus}
            onChange={e => updateBasicInfo({ filingStatus: e.target.value })}
          >
            {FILING_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        {/* Age */}
        <div>
          <Label htmlFor="age">Your Age</Label>
          <input
            id="age"
            type="number"
            min={0}
            className={clsx("w-full bg-muted text-foreground border rounded-md py-2", isInvalid(basicInfoData.age) && touched['age'] && "border-destructive")}
            value={basicInfoData.age}
            onChange={e => { updateBasicInfo({ age: parseInt(e.target.value) }); setTouched(t => ({ ...t, age: true })); }}
          />
          {isInvalid(basicInfoData.age) && touched['age'] && (
            <span className="text-xs text-destructive">Enter valid age</span>
          )}
        </div>
      </div>

      {/* Section Header */}
      <h4 className="text-lg font-semibold mb-4">Income Sources</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Standard sources */}
        {incomeSources.slice(0, 6).map((src, idx) => (
          <div key={idx}>
            <Label>{src.label}</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencyInfo?.symbol}</span>
              <input
                type="number"
                className={clsx("w-full pl-8 bg-muted text-foreground border rounded-md py-2", isInvalid(src.value) && touched[idx] && "border-destructive")}
                value={src.value}
                onChange={e => handleIncomeChange(idx, e.target.value)}
                min={0}
                onBlur={() => setTouched(t => ({ ...t, [idx]: true }))}
              />
              {isInvalid(src.value) && touched[idx] && (
                <span className="text-xs text-destructive absolute right-2 top-1/2 -translate-y-1/2">Enter valid amount</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Custom sources */}
      {incomeSources.length > 6 && (
        <div className="mb-4">
          <h5 className="font-medium mb-2">Custom Income Sources</h5>
          <div className="space-y-2">
            {incomeSources.slice(6).map((src, idx) => (
              <div key={6 + idx} className="flex items-center gap-2">
                <Label className="flex-1">{src.label}</Label>
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencyInfo?.symbol}</span>
                  <input
                    type="number"
                    className={clsx("w-full pl-8 bg-muted text-foreground border rounded-md py-2", isInvalid(src.value) && touched[6 + idx] && "border-destructive")}
                    value={src.value}
                    onChange={e => handleIncomeChange(6 + idx, e.target.value)}
                    min={0}
                    onBlur={() => setTouched(t => ({ ...t, [6 + idx]: true }))}
                  />
                  {isInvalid(src.value) && touched[6 + idx] && (
                    <span className="text-xs text-destructive absolute right-2 top-1/2 -translate-y-1/2">Enter valid amount</span>
                  )}
                </div>
                <button
                  type="button"
                  className="text-destructive hover:bg-destructive/10 rounded p-1"
                  onClick={() => handleRemoveCustomSource(6 + idx)}
                  aria-label="Remove"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add Custom Income Source */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          placeholder="Label (e.g. Rental Income)"
          value={newSourceLabel}
          onChange={e => setNewSourceLabel(e.target.value)}
          className="bg-muted text-foreground md:w-1/3 border rounded-md py-2 px-3"
        />
        <div className="relative md:w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencyInfo?.symbol}</span>
          <input
            placeholder="Amount"
            type="number"
            value={newSourceAmount}
            onChange={e => setNewSourceAmount(e.target.value)}
            className={clsx("w-full pl-8 bg-muted text-foreground border rounded-md py-2", isInvalid(parseFloat(newSourceAmount)) && newSourceAmount !== '' && "border-destructive")}
            min={0}
            onBlur={() => setTouched(t => ({ ...t, custom: true }))}
          />
          {isInvalid(parseFloat(newSourceAmount)) && newSourceAmount !== '' && (
            <span className="text-xs text-destructive absolute right-2 top-1/2 -translate-y-1/2">Enter valid amount</span>
          )}
        </div>
        <Button type="button" onClick={handleAddIncomeSource} className={clsx("md:w-1/6", allValid ? "animate-bounce" : "opacity-50 pointer-events-none")}>Add Income Source</Button>
      </div>
      {/* Live Summary */}
      <div className="bg-muted rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <span className="font-medium">Total Gross Income:</span> <span className="text-primary font-semibold">{currencyInfo?.symbol}{totalGrossIncome.toLocaleString()}</span>
        </div>
        <div>
          <span className="font-medium">Fields Filled:</span> <span className={filledFields >= 1 ? "text-primary font-semibold" : ""}>{filledFields}</span> / {totalFields}
        </div>
      </div>
      {/* Continue Button */}
      <div className="flex justify-end">
        <Button className={clsx("bg-primary", allValid ? "animate-pulse" : "opacity-50 pointer-events-none")}
          onClick={handleContinue}
          disabled={!allValid}
        >
          Continue to Deductions
        </Button>
      </div>
    </div>
  );
};

export default BasicInfo;

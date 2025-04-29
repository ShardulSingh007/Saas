import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  IncomeData, 
  DeductionsData, 
  CreditsData, 
  CalculationResults 
} from "@shared/schema";
import { calculateTax, parseCurrencyInput, formatCurrency } from "@/lib/taxCalculator";
import { filingStatuses } from "@/lib/constants";

// Steps for the tax calculator
export enum Step {
  BasicInfo = 0,
  Deductions = 1,
  Credits = 2,
  Results = 3,
}

// Default income data (empty as per user request)
const defaultIncomeData: IncomeData = {
  employment: {
    salary: 0,
    withheld: 0,
  },
  selfEmployment: {
    business: 0,
    expenses: 0,
  },
  investment: {
    dividends: 0,
    capitalGains: 0,
  },
  other: [],
};

// Default deductions data
const defaultDeductionsData: DeductionsData = {
  standard: true,
  itemized: {
    mortgage: 0,
    stateTaxes: 0,
    charitableDonations: 0,
    medicalExpenses: 0,
    studentLoanInterest: 0,
    retirement: 0,
    other: [],
  },
};

// Default credits data
const defaultCreditsData: CreditsData = {
  childTaxCredit: {
    qualifying: 0,
  },
  earnedIncome: false,
  education: {
    tuition: 0,
  },
  other: [],
};

interface TaxCalculatorContextType {
  currentStep: Step;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  taxYear: number;
  setTaxYear: React.Dispatch<React.SetStateAction<number>>;
  filingStatus: string;
  setFilingStatus: React.Dispatch<React.SetStateAction<string>>;
  age: number;
  setAge: React.Dispatch<React.SetStateAction<number>>;
  incomeData: IncomeData;
  setIncomeData: React.Dispatch<React.SetStateAction<IncomeData>>;
  deductionsData: DeductionsData;
  setDeductionsData: React.Dispatch<React.SetStateAction<DeductionsData>>;
  creditsData: CreditsData;
  setCreditsData: React.Dispatch<React.SetStateAction<CreditsData>>;
  calculationResults: CalculationResults | null;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: Step) => void;
  updateSalary: (value: string) => void;
  updateTaxWithheld: (value: string) => void;
  updateBusinessIncome: (value: string) => void;
  updateBusinessExpenses: (value: string) => void;
  updateDividends: (value: string) => void;
  updateCapitalGains: (value: string) => void;
  addOtherIncome: (name: string, amount: string) => void;
  removeOtherIncome: (index: number) => void;
  toggleDeductionType: (useStandard: boolean) => void;
  updateItemizedDeduction: (type: keyof DeductionsData['itemized'], value: string) => void;
  addOtherDeduction: (name: string, amount: string) => void;
  removeOtherDeduction: (index: number) => void;
  updateChildTaxCredit: (value: string) => void;
  toggleEarnedIncome: (value: boolean) => void;
  updateEducationTuition: (value: string) => void;
  addOtherCredit: (name: string, amount: string) => void;
  removeOtherCredit: (index: number) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearAllData: () => void;
  formatCurrencyWithCountry: (amount: number) => string;
}

const TaxCalculatorContext = createContext<TaxCalculatorContextType | undefined>(undefined);

export const TaxCalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Step state
  const [currentStep, setCurrentStep] = useState<Step>(Step.BasicInfo);
  
  // Basic info state
  const [country, setCountry] = useState<string>("us");
  const [taxYear, setTaxYear] = useState<number>(2023);
  const [filingStatus, setFilingStatus] = useState<string>("single");
  const [age, setAge] = useState<number>(30);
  
  // Income data state
  const [incomeData, setIncomeData] = useState<IncomeData>(defaultIncomeData);
  
  // Deductions data state
  const [deductionsData, setDeductionsData] = useState<DeductionsData>(defaultDeductionsData);
  
  // Credits data state
  const [creditsData, setCreditsData] = useState<CreditsData>(defaultCreditsData);
  
  // Calculation results
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  
  // Update calculation results whenever inputs change
  useEffect(() => {
    try {
      const results = calculateTax({
        country,
        taxYear,
        filingStatus,
        age,
        incomeData,
        deductionsData,
        creditsData,
      });
      
      setCalculationResults(results);
    } catch (error) {
      console.error("Error calculating tax:", error);
    }
  }, [country, taxYear, filingStatus, age, incomeData, deductionsData, creditsData]);
  
  // Update filing status options when country changes
  useEffect(() => {
    const availableStatuses = filingStatuses[country] || filingStatuses.us;
    // If current filing status is not available for the new country, set to the first available option
    if (!availableStatuses.find(status => status.id === filingStatus)) {
      setFilingStatus(availableStatuses[0].id);
    }
  }, [country, filingStatus]);
  
  // Navigation functions
  const nextStep = () => {
    if (currentStep < Step.Results) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > Step.BasicInfo) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };
  
  // Income data update functions
  const updateSalary = (value: string) => {
    setIncomeData(prev => ({
      ...prev,
      employment: {
        ...prev.employment,
        salary: parseCurrencyInput(value),
      },
    }));
  };
  
  const updateTaxWithheld = (value: string) => {
    setIncomeData(prev => ({
      ...prev,
      employment: {
        ...prev.employment,
        withheld: parseCurrencyInput(value),
      },
    }));
  };
  
  const updateBusinessIncome = (value: string) => {
    setIncomeData(prev => ({
      ...prev,
      selfEmployment: {
        ...prev.selfEmployment,
        business: parseCurrencyInput(value),
      },
    }));
  };
  
  const updateBusinessExpenses = (value: string) => {
    setIncomeData(prev => ({
      ...prev,
      selfEmployment: {
        ...prev.selfEmployment,
        expenses: parseCurrencyInput(value),
      },
    }));
  };
  
  const updateDividends = (value: string) => {
    setIncomeData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        dividends: parseCurrencyInput(value),
      },
    }));
  };
  
  const updateCapitalGains = (value: string) => {
    setIncomeData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        capitalGains: parseCurrencyInput(value),
      },
    }));
  };
  
  const addOtherIncome = (name: string, amount: string) => {
    if (!name.trim()) return;
    
    setIncomeData(prev => ({
      ...prev,
      other: [
        ...prev.other,
        { name, amount: parseCurrencyInput(amount) },
      ],
    }));
  };
  
  const removeOtherIncome = (index: number) => {
    setIncomeData(prev => ({
      ...prev,
      other: prev.other.filter((_, i) => i !== index),
    }));
  };
  
  // Deductions data update functions
  const toggleDeductionType = (useStandard: boolean) => {
    setDeductionsData(prev => ({
      ...prev,
      standard: useStandard,
    }));
  };
  
  const updateItemizedDeduction = (type: keyof DeductionsData['itemized'], value: string) => {
    if (type === 'other') return; // 'other' is an array, handle separately
    
    setDeductionsData(prev => ({
      ...prev,
      itemized: {
        ...prev.itemized,
        [type]: parseCurrencyInput(value),
      },
    }));
  };
  
  const addOtherDeduction = (name: string, amount: string) => {
    if (!name.trim()) return;
    
    setDeductionsData(prev => ({
      ...prev,
      itemized: {
        ...prev.itemized,
        other: [
          ...prev.itemized.other,
          { name, amount: parseCurrencyInput(amount) },
        ],
      },
    }));
  };
  
  const removeOtherDeduction = (index: number) => {
    setDeductionsData(prev => ({
      ...prev,
      itemized: {
        ...prev.itemized,
        other: prev.itemized.other.filter((_, i) => i !== index),
      },
    }));
  };
  
  // Credits data update functions
  const updateChildTaxCredit = (value: string) => {
    setCreditsData(prev => ({
      ...prev,
      childTaxCredit: {
        ...prev.childTaxCredit,
        qualifying: parseInt(value, 10) || 0,
      },
    }));
  };
  
  const toggleEarnedIncome = (value: boolean) => {
    setCreditsData(prev => ({
      ...prev,
      earnedIncome: value,
    }));
  };
  
  const updateEducationTuition = (value: string) => {
    setCreditsData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        tuition: parseCurrencyInput(value),
      },
    }));
  };
  
  const addOtherCredit = (name: string, amount: string) => {
    if (!name.trim()) return;
    
    setCreditsData(prev => ({
      ...prev,
      other: [
        ...prev.other,
        { name, amount: parseCurrencyInput(amount) },
      ],
    }));
  };
  
  const removeOtherCredit = (index: number) => {
    setCreditsData(prev => ({
      ...prev,
      other: prev.other.filter((_, i) => i !== index),
    }));
  };
  
  // LocalStorage functions
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('taxCalculator_country', country);
      localStorage.setItem('taxCalculator_taxYear', taxYear.toString());
      localStorage.setItem('taxCalculator_filingStatus', filingStatus);
      localStorage.setItem('taxCalculator_age', age.toString());
      localStorage.setItem('taxCalculator_incomeData', JSON.stringify(incomeData));
      localStorage.setItem('taxCalculator_deductionsData', JSON.stringify(deductionsData));
      localStorage.setItem('taxCalculator_creditsData', JSON.stringify(creditsData));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };
  
  const loadFromLocalStorage = () => {
    try {
      const savedCountry = localStorage.getItem('taxCalculator_country');
      const savedTaxYear = localStorage.getItem('taxCalculator_taxYear');
      const savedFilingStatus = localStorage.getItem('taxCalculator_filingStatus');
      const savedAge = localStorage.getItem('taxCalculator_age');
      const savedIncomeData = localStorage.getItem('taxCalculator_incomeData');
      const savedDeductionsData = localStorage.getItem('taxCalculator_deductionsData');
      const savedCreditsData = localStorage.getItem('taxCalculator_creditsData');
      
      if (savedCountry) setCountry(savedCountry);
      if (savedTaxYear) setTaxYear(parseInt(savedTaxYear, 10));
      if (savedFilingStatus) setFilingStatus(savedFilingStatus);
      if (savedAge) setAge(parseInt(savedAge, 10));
      if (savedIncomeData) setIncomeData(JSON.parse(savedIncomeData));
      if (savedDeductionsData) setDeductionsData(JSON.parse(savedDeductionsData));
      if (savedCreditsData) setCreditsData(JSON.parse(savedCreditsData));
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };
  
  const clearAllData = () => {
    setIncomeData(defaultIncomeData);
    setDeductionsData(defaultDeductionsData);
    setCreditsData(defaultCreditsData);
    setCountry("us");
    setTaxYear(2023);
    setFilingStatus("single");
    setAge(30);
    
    // Clear localStorage
    try {
      localStorage.removeItem('taxCalculator_country');
      localStorage.removeItem('taxCalculator_taxYear');
      localStorage.removeItem('taxCalculator_filingStatus');
      localStorage.removeItem('taxCalculator_age');
      localStorage.removeItem('taxCalculator_incomeData');
      localStorage.removeItem('taxCalculator_deductionsData');
      localStorage.removeItem('taxCalculator_creditsData');
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };
  
  // Format currency with the current country
  const formatCurrencyWithCountry = useCallback((amount: number) => {
    return formatCurrency(amount, country);
  }, [country]);

  // Try to load data from localStorage on first render
  useEffect(() => {
    loadFromLocalStorage();
  }, []);
  
  const contextValue: TaxCalculatorContextType = {
    currentStep,
    setCurrentStep,
    country,
    setCountry,
    taxYear,
    setTaxYear,
    filingStatus,
    setFilingStatus,
    age,
    setAge,
    incomeData,
    setIncomeData,
    deductionsData,
    setDeductionsData,
    creditsData,
    setCreditsData,
    calculationResults,
    nextStep,
    prevStep,
    goToStep,
    updateSalary,
    updateTaxWithheld,
    updateBusinessIncome,
    updateBusinessExpenses,
    updateDividends,
    updateCapitalGains,
    addOtherIncome,
    removeOtherIncome,
    toggleDeductionType,
    updateItemizedDeduction,
    addOtherDeduction,
    removeOtherDeduction,
    updateChildTaxCredit,
    toggleEarnedIncome,
    updateEducationTuition,
    addOtherCredit,
    removeOtherCredit,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearAllData,
    formatCurrencyWithCountry,
  };
  
  return (
    <TaxCalculatorContext.Provider value={contextValue}>
      {children}
    </TaxCalculatorContext.Provider>
  );
};

export const useTaxCalculator = () => {
  const context = useContext(TaxCalculatorContext);
  if (context === undefined) {
    throw new Error("useTaxCalculator must be used within a TaxCalculatorProvider");
  }
  return context;
};

import { IncomeData, DeductionsData, CreditsData, CalculationResults } from "@shared/schema";
import { taxBrackets } from "./constants";

type TaxCalculatorParams = {
  country: string;
  taxYear: number;
  filingStatus: string;
  age: number;
  incomeData: IncomeData;
  deductionsData?: DeductionsData;
  creditsData?: CreditsData;
};

// Main calculation function
export function calculateTax({
  country,
  taxYear,
  filingStatus,
  age,
  incomeData,
  deductionsData,
  creditsData,
}: TaxCalculatorParams): CalculationResults {
  // Get the total income from all sources
  const totalIncome = calculateTotalIncome(incomeData);
  
  // Calculate adjusted gross income (after certain adjustments)
  const adjustedGrossIncome = calculateAGI(totalIncome, incomeData);
  
  // Calculate total deductions
  const totalDeductions = calculateDeductions(adjustedGrossIncome, deductionsData, filingStatus, country, taxYear);
  
  // Calculate taxable income (AGI minus deductions)
  const taxableIncome = Math.max(0, adjustedGrossIncome - totalDeductions);
  
  // Calculate federal income tax
  const federalTax = calculateFederalIncomeTax(taxableIncome, filingStatus, country, taxYear);
  
  // Calculate state income tax (simplified)
  const stateTax = calculateStateTax(taxableIncome, country, filingStatus);
  
  // Calculate self-employment tax
  const selfEmploymentTax = calculateSelfEmploymentTax(incomeData.selfEmployment, country);
  
  // Calculate tax credits
  const taxCredits = calculateTaxCredits(creditsData, country, taxYear);
  
  // Calculate total tax after credits
  const totalTaxBeforeCredits = federalTax + stateTax + selfEmploymentTax;
  const totalTax = Math.max(0, totalTaxBeforeCredits - taxCredits);
  
  // Calculate effective tax rate
  const effectiveTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
  
  // Calculate take-home pay
  const takeHomePay = totalIncome - totalTax;
  
  // Get the tax brackets with actual tax paid in each bracket
  const taxBracketsWithTax = calculateTaxBracketBreakdown(taxableIncome, filingStatus, country, taxYear);
  
  // Generate tax saving tips based on user's input
  const taxSavingsTips = generateTaxSavingsTips({
    incomeData,
    deductionsData,
    adjustedGrossIncome,
    filingStatus,
    age,
    country,
    taxYear,
  });
  
  return {
    totalIncome,
    adjustedGrossIncome,
    totalDeductions,
    taxableIncome,
    federalTax,
    stateTax,
    selfEmploymentTax,
    totalTax,
    effectiveTaxRate,
    takeHomePay,
    taxBrackets: taxBracketsWithTax,
    taxSavingsTips,
  };
}

// Calculate total income from all sources
function calculateTotalIncome(incomeData: IncomeData): number {
  const employmentIncome = incomeData.employment.salary;
  const selfEmploymentIncome = Math.max(0, incomeData.selfEmployment.business - incomeData.selfEmployment.expenses);
  const investmentIncome = incomeData.investment.dividends + incomeData.investment.capitalGains;
  const otherIncome = incomeData.other.reduce((sum, item) => sum + item.amount, 0);
  
  return employmentIncome + selfEmploymentIncome + investmentIncome + otherIncome;
}

// Calculate Adjusted Gross Income
function calculateAGI(totalIncome: number, incomeData: IncomeData): number {
  // This is simplified - in real world, there would be more adjustments
  // Potential adjustments: student loan interest, health savings account contributions, etc.
  const selfEmploymentTaxDeduction = calculateSelfEmploymentTax(incomeData.selfEmployment, 'us') / 2;
  
  return totalIncome - selfEmploymentTaxDeduction;
}

// Calculate deductions
function calculateDeductions(
  agi: number,
  deductionsData: DeductionsData | undefined,
  filingStatus: string,
  country: string,
  taxYear: number
): number {
  if (!deductionsData) {
    // Return standard deduction if no deduction data provided
    return getStandardDeduction(filingStatus, country, taxYear);
  }
  
  if (deductionsData.standard) {
    return getStandardDeduction(filingStatus, country, taxYear);
  } else {
    // Calculate itemized deductions
    const itemizedTotal = 
      deductionsData.itemized.mortgage +
      deductionsData.itemized.stateTaxes +
      deductionsData.itemized.charitableDonations +
      deductionsData.itemized.medicalExpenses +
      deductionsData.itemized.studentLoanInterest +
      deductionsData.itemized.retirement +
      deductionsData.itemized.other.reduce((sum, item) => sum + item.amount, 0);
    
    // Return the greater of standard or itemized deductions
    const standardDeduction = getStandardDeduction(filingStatus, country, taxYear);
    return Math.max(standardDeduction, itemizedTotal);
  }
}

// Get standard deduction based on filing status and tax year
function getStandardDeduction(filingStatus: string, country: string, taxYear: number): number {
  if (country === 'us') {
    // US Standard Deduction for 2023
    if (taxYear === 2023) {
      switch (filingStatus) {
        case 'single': return 13850;
        case 'mfj': return 27700;
        case 'mfs': return 13850;
        case 'hoh': return 20800;
        default: return 12950;
      }
    }
    // US Standard Deduction for 2022
    else if (taxYear === 2022) {
      switch (filingStatus) {
        case 'single': return 12950;
        case 'mfj': return 25900;
        case 'mfs': return 12950;
        case 'hoh': return 19400;
        default: return 12550;
      }
    }
    // US Standard Deduction for 2021
    else {
      switch (filingStatus) {
        case 'single': return 12550;
        case 'mfj': return 25100;
        case 'mfs': return 12550;
        case 'hoh': return 18800;
        default: return 12400;
      }
    }
  }
  // Simplified standard deductions for other countries
  else if (country === 'ca') {
    return 15000;
  }
  else if (country === 'uk') {
    return 12570; // Personal Allowance
  }
  else if (country === 'au') {
    return 18200; // Tax Free Threshold
  }
  
  // Default
  return 12000;
}

// Calculate federal income tax using progressive tax brackets
function calculateFederalIncomeTax(taxableIncome: number, filingStatus: string, country: string, taxYear: number): number {
  const brackets = getTaxBrackets(filingStatus, country, taxYear);
  let tax = 0;
  
  // Calculate tax based on progressive tax brackets
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const nextBracket = brackets[i + 1];
    
    if (taxableIncome <= 0) break;
    
    if (nextBracket && taxableIncome > bracket.max) {
      // Fully taxed in this bracket
      tax += (bracket.max - bracket.min) * bracket.rate;
    } else {
      // Partially taxed in this bracket (or the highest bracket)
      const amountInBracket = taxableIncome - bracket.min;
      tax += amountInBracket * bracket.rate;
      break;
    }
  }
  
  return tax;
}

// Get tax brackets based on filing status and tax year
function getTaxBrackets(filingStatus: string, country: string, taxYear: number) {
  // Get tax brackets from constants
  return taxBrackets[country]?.[taxYear]?.[filingStatus] || [];
}

// Calculate tax bracket breakdown for visualization
function calculateTaxBracketBreakdown(taxableIncome: number, filingStatus: string, country: string, taxYear: number) {
  const brackets = getTaxBrackets(filingStatus, country, taxYear);
  const result = [];
  
  let remainingIncome = taxableIncome;
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const bracketMin = bracket.min;
    const bracketMax = bracket.max;
    const bracketRate = bracket.rate;
    
    // Calculate amount taxed in this bracket
    let taxableInThisBracket = 0;
    
    if (remainingIncome <= 0) {
      // No more income to tax
      taxableInThisBracket = 0;
    } else if (bracketMax && remainingIncome <= bracketMax - bracketMin) {
      // Partially taxed in this bracket
      taxableInThisBracket = remainingIncome;
      remainingIncome = 0;
    } else {
      // Fully taxed in this bracket
      taxableInThisBracket = bracketMax ? bracketMax - bracketMin : remainingIncome;
      remainingIncome -= taxableInThisBracket;
    }
    
    const taxInBracket = taxableInThisBracket * bracketRate;
    
    result.push({
      min: bracketMin,
      max: bracketMax,
      rate: bracketRate,
      tax: taxInBracket,
    });
    
    if (remainingIncome <= 0) {
      break;
    }
  }
  
  return result;
}

// Calculate state income tax (simplified)
function calculateStateTax(taxableIncome: number, country: string, filingStatus: string): number {
  // Simplified state tax calculation
  if (country === 'us') {
    // Estimate average state tax rate (varies by state in reality)
    return taxableIncome * 0.05;
  }
  
  // For other countries, provincial/regional taxes would be calculated here
  return 0;
}

// Calculate self-employment tax
function calculateSelfEmploymentTax(selfEmploymentData: IncomeData['selfEmployment'], country: string): number {
  const netSelfEmploymentIncome = Math.max(0, selfEmploymentData.business - selfEmploymentData.expenses);
  
  if (country === 'us') {
    // US self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare)
    if (netSelfEmploymentIncome <= 400) {
      return 0; // No SE tax if less than $400
    }
    
    // Social Security portion is capped (142,800 for 2021, 147,000 for 2022, 160,200 for 2023)
    const socialSecurityCap = 160200; // For 2023
    const socialSecurityTax = Math.min(netSelfEmploymentIncome, socialSecurityCap) * 0.124;
    
    // Medicare portion has no cap
    const medicareTax = netSelfEmploymentIncome * 0.029;
    
    return socialSecurityTax + medicareTax;
  }
  
  // For other countries, equivalent taxes would be calculated
  return 0;
}

// Calculate tax credits
function calculateTaxCredits(creditsData: CreditsData | undefined, country: string, taxYear: number): number {
  if (!creditsData) return 0;
  
  let totalCredits = 0;
  
  if (country === 'us') {
    // Child Tax Credit
    const childTaxCreditAmount = (taxYear >= 2022) ? 2000 : 3600; // $3,600 for 2021 (enhanced), $2,000 for 2022-2023
    totalCredits += creditsData.childTaxCredit.qualifying * childTaxCreditAmount;
    
    // Education credits
    if (creditsData.education.tuition > 0) {
      // American Opportunity Tax Credit (simplified)
      totalCredits += Math.min(creditsData.education.tuition * 0.25, 2500);
    }
    
    // Other credits
    totalCredits += creditsData.other.reduce((sum, credit) => sum + credit.amount, 0);
  }
  
  return totalCredits;
}

// Generate tax saving tips based on user inputs
function generateTaxSavingsTips({
  incomeData,
  deductionsData,
  adjustedGrossIncome,
  filingStatus,
  age,
  country,
  taxYear,
}: {
  incomeData: IncomeData;
  deductionsData?: DeductionsData;
  adjustedGrossIncome: number;
  filingStatus: string;
  age: number;
  country: string;
  taxYear: number;
}) {
  const tips = [];
  
  if (country === 'us') {
    // Retirement contribution tip
    const hasRetirementContribution = deductionsData?.itemized.retirement && deductionsData.itemized.retirement > 0;
    if (!hasRetirementContribution && incomeData.employment.salary > 30000) {
      const potentialContribution = Math.min(adjustedGrossIncome * 0.1, 6000);
      const taxRate = estimateMarginalTaxRate(adjustedGrossIncome, filingStatus, country, taxYear);
      const potentialSavings = potentialContribution * taxRate;
      
      tips.push({
        description: "Consider 401K contributions through your employer to reduce taxable income.",
        savings: potentialSavings,
      });
    }
    
    // HSA contribution tip
    if (adjustedGrossIncome > 30000) {
      const hsaLimit = filingStatus === 'single' ? 3850 : 7750; // 2023 limits
      const potentialSavings = hsaLimit * estimateMarginalTaxRate(adjustedGrossIncome, filingStatus, country, taxYear);
      
      tips.push({
        description: "Opening a Health Savings Account (HSA) can reduce your taxable income.",
        savings: potentialSavings,
      });
    }
    
    // Charitable contribution tip if income is high
    if (adjustedGrossIncome > 100000 && (!deductionsData?.itemized.charitableDonations || deductionsData.itemized.charitableDonations < 1000)) {
      const suggestedDonation = Math.min(adjustedGrossIncome * 0.03, 5000);
      const taxRate = estimateMarginalTaxRate(adjustedGrossIncome, filingStatus, country, taxYear);
      const potentialSavings = suggestedDonation * taxRate;
      
      tips.push({
        description: "Charitable donations can reduce your taxable income if you itemize deductions.",
        savings: potentialSavings,
      });
    }
  }
  
  return tips;
}

// Estimate marginal tax rate (for tax saving calculations)
function estimateMarginalTaxRate(income: number, filingStatus: string, country: string, taxYear: number): number {
  const brackets = getTaxBrackets(filingStatus, country, taxYear);
  
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income > brackets[i].min) {
      return brackets[i].rate;
    }
  }
  
  return brackets[0]?.rate || 0.1;
}

// Format currency for display
export function formatCurrency(amount: number, country?: string): string {
  // Default to USD if no country is provided
  const currencyFormats: {[key: string]: {locale: string, currency: string}} = {
    'us': { locale: 'en-US', currency: 'USD' },
    'ca': { locale: 'en-CA', currency: 'CAD' },
    'uk': { locale: 'en-GB', currency: 'GBP' },
    'au': { locale: 'en-AU', currency: 'AUD' },
    'in': { locale: 'en-IN', currency: 'INR' },
    'fr': { locale: 'fr-FR', currency: 'EUR' },
    'de': { locale: 'de-DE', currency: 'EUR' },
    'jp': { locale: 'ja-JP', currency: 'JPY' }
  };

  const format = country && currencyFormats[country.toLowerCase()] 
    ? currencyFormats[country.toLowerCase()] 
    : currencyFormats['us'];

  return new Intl.NumberFormat(format.locale, {
    style: 'currency',
    currency: format.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Parse currency input string to number
export function parseCurrencyInput(input: string): number {
  // Remove currency symbols, commas, and spaces
  const cleanedInput = input.replace(/[$,\s]/g, '');
  const parsedValue = parseFloat(cleanedInput);
  return isNaN(parsedValue) ? 0 : parsedValue;
}

// Format percentage for display
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}


import React from "react";
import { Step } from "./TaxCalculatorProvider";

interface StepProgressProps {
  currentStep: Step;
}

interface StepItemProps {
  step: number;
  label: string;
  active: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ step, label, active }) => {
  return (
    <div className="tax-calculator-step">
      <div className={`tax-calculator-step-circle ${active ? 'active' : 'inactive'}`}>
        <span className={`${active ? 'text-white' : 'text-muted-foreground'} font-medium`}>{step}</span>
      </div>
      <span className={`text-sm ${active ? 'text-white' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  );
};

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const steps = [
    { step: 1, label: "Basics" },
    { step: 2, label: "Deductions" },
    { step: 3, label: "Credits" },
    { step: 4, label: "Results" }
  ];

  const getProgressWidth = () => {
    switch (currentStep) {
      case Step.BasicInfo:
        return "w-1/3";
      case Step.Deductions:
        return "w-2/3";
      case Step.Credits:
        return "w-full";
      case Step.Results:
        return "w-full";
      default:
        return "w-0";
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {steps.map((step, index) => (
        <div key={`step-${index}`} className="flex items-center flex-1">
          <StepItem 
            key={`step-item-${index}`}
            step={step.step} 
            label={step.label} 
            active={currentStep >= index + 1} 
          />
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 bg-muted mx-2">
              <div 
                className={`h-full bg-blue-500 transition-all duration-300 ease-in-out ${
                  index < currentStep - 1 ? 'w-full' : 
                  index === currentStep - 1 ? getProgressWidth() : 'w-0'
                }`} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepProgress;

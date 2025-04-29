import React from "react";
import { useTaxCalculator, Step } from "./TaxCalculatorProvider";
import StepProgress from "./StepProgress";
import BasicInfo from "./Steps/BasicInfo";
import Deductions from "./Steps/Deductions";
import Credits from "./Steps/Credits";
import Results from "./Steps/Results";
import SalesTaxCalculator from "./SalesTaxCalculator";

const MainContent: React.FC = () => {
  const { currentStep } = useTaxCalculator();

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.BasicInfo:
        return <BasicInfo />;
      case Step.Deductions:
        return <Deductions />;
      case Step.Credits:
        return <Credits />;
      case Step.Results:
        return <Results />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4">
          <div className="bg-muted rounded-lg p-5 mb-6">
            <h2 className="text-xl font-semibold mb-4">Calculate Your Taxes</h2>
            <p className="text-muted-foreground mb-5">
              Completion of steps to get your personalized tax calculation.
            </p>
            
            <StepProgress currentStep={currentStep} />
            
            {renderStepContent()}
          </div>
          
          <div className="grid gap-6 md:grid-cols-1">
            <SalesTaxCalculator />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainContent;

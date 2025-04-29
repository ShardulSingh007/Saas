import React from "react";
import TaxCalculator from "@/components/TaxCalculator";
import { Helmet } from "react-helmet";

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Tax Calculator | Comprehensive Tax Calculator Tool</title>
        <meta name="description" content="Calculate your taxes with our comprehensive tax calculator for multiple countries. Estimate income tax, self-employment tax, identify deductions and tax credits." />
      </Helmet>
      <TaxCalculator />
    </>
  );
};

export default Home;

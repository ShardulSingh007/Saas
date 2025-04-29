import React from "react";
import { Chart } from "@/components/ui/chart";
import { CalculationResults } from "@shared/schema";

interface TaxBreakdownChartProps {
  calculationResults: CalculationResults;
}

export const TaxBreakdownChart: React.FC<TaxBreakdownChartProps> = ({ calculationResults }) => {
  const { federalTax, stateTax, selfEmploymentTax, takeHomePay } = calculationResults;
  
  const data = {
    labels: ['Federal Income Tax', 'State Income Tax', 'Self-Employment Tax', 'Take Home Pay'],
    datasets: [{
      data: [
        parseFloat(federalTax.toFixed(2)), 
        parseFloat(stateTax.toFixed(2)), 
        parseFloat(selfEmploymentTax.toFixed(2)), 
        parseFloat(takeHomePay.toFixed(2))
      ],
      backgroundColor: [
        'hsl(var(--chart-1))', // Red for federal tax
        'hsl(var(--chart-2))', // Amber for state tax
        'hsl(var(--chart-3))', // Blue for self-employment tax
        'hsl(var(--chart-4))', // Green for take home pay
      ],
      borderWidth: 0
    }]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <Chart 
      type="pie" 
      data={data} 
      options={options}
      className="tax-chart-container" 
    />
  );
};

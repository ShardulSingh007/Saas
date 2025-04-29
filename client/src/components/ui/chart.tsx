import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ChartOptions, registerables, ChartData, ChartType } from "chart.js";

ChartJS.register(...registerables);

export interface ChartProps {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
  className?: string;
  width?: number;
  height?: number;
}

const Chart = ({ type, data, options, className }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      chartRef.current = new ChartJS(ctx, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={canvasRef} className={className} />;
};

export { Chart };

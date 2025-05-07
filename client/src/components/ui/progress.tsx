"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink';
}

export function Progress({
  value = 0,
  max = 100,
  showValue = false,
  size = 'md',
  color = 'blue',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="relative">
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          size === 'sm' && 'h-1',
          size === 'md' && 'h-2',
          size === 'lg' && 'h-4',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-in-out',
            color === 'blue' && 'bg-blue-500 dark:bg-blue-400',
            color === 'green' && 'bg-green-500 dark:bg-green-400',
            color === 'red' && 'bg-red-500 dark:bg-red-400',
            color === 'yellow' && 'bg-yellow-500 dark:bg-yellow-400',
            color === 'purple' && 'bg-purple-500 dark:bg-purple-400',
            color === 'pink' && 'bg-pink-500 dark:bg-pink-400'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

interface ProgressGroupProps {
  items: { value: number; max: number; label: string }[];
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink';
  className?: string;
}

export function ProgressGroup({
  items,
  showValue = false,
  size = 'md',
  color = 'blue',
  className,
}: ProgressGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {item.label}
            </span>
            {showValue && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.value} / {item.max}
              </span>
            )}
          </div>
          <Progress
            value={item.value}
            max={item.max}
            showValue={false}
            size={size}
            color={color}
          />
        </div>
      ))}
    </div>
  );
}

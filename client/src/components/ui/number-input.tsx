import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, error, min, max, step = 1, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400',
            error && 'border-red-500 focus-visible:ring-red-500 dark:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </div>
        )}
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

interface NumberRangeInputProps {
  startValue: number;
  endValue: number;
  onStartValueChange: (value: number) => void;
  onEndValueChange: (value: number) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberRangeInput({
  startValue,
  endValue,
  onStartValueChange,
  onEndValueChange,
  error,
  className,
  disabled,
  min,
  max,
  step,
}: NumberRangeInputProps) {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <NumberInput
        value={startValue}
        onChange={(e) => onStartValueChange(Number(e.target.value))}
        error={error}
        disabled={disabled}
        max={endValue}
        min={min}
        step={step}
      />
      <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
      <NumberInput
        value={endValue}
        onChange={(e) => onEndValueChange(Number(e.target.value))}
        error={error}
        disabled={disabled}
        min={startValue}
        max={max}
        step={step}
      />
    </div>
  );
} 
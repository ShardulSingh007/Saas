import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface YearPickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const YearPicker = forwardRef<HTMLInputElement, YearPickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="number"
          min="1900"
          max="2100"
          step="1"
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
YearPicker.displayName = 'YearPicker';

interface YearRangePickerProps {
  startYear: string;
  endYear: string;
  onStartYearChange: (year: string) => void;
  onEndYearChange: (year: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function YearRangePicker({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
  error,
  className,
  disabled,
}: YearRangePickerProps) {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <YearPicker
        value={startYear}
        onChange={(e) => onStartYearChange(e.target.value)}
        error={error}
        disabled={disabled}
        max={endYear}
      />
      <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
      <YearPicker
        value={endYear}
        onChange={(e) => onEndYearChange(e.target.value)}
        error={error}
        disabled={disabled}
        min={startYear}
      />
    </div>
  );
} 
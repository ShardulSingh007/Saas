import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface MonthPickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MonthPicker = forwardRef<HTMLInputElement, MonthPickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="month"
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
MonthPicker.displayName = 'MonthPicker';

interface MonthRangePickerProps {
  startMonth: string;
  endMonth: string;
  onStartMonthChange: (month: string) => void;
  onEndMonthChange: (month: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function MonthRangePicker({
  startMonth,
  endMonth,
  onStartMonthChange,
  onEndMonthChange,
  error,
  className,
  disabled,
}: MonthRangePickerProps) {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <MonthPicker
        value={startMonth}
        onChange={(e) => onStartMonthChange(e.target.value)}
        error={error}
        disabled={disabled}
        max={endMonth}
      />
      <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
      <MonthPicker
        value={endMonth}
        onChange={(e) => onEndMonthChange(e.target.value)}
        error={error}
        disabled={disabled}
        min={startMonth}
      />
    </div>
  );
} 
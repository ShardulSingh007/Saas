import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface DateTimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="datetime-local"
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
DateTimePicker.displayName = 'DateTimePicker';

interface DateTimeRangePickerProps {
  startDateTime: string;
  endDateTime: string;
  onStartDateTimeChange: (datetime: string) => void;
  onEndDateTimeChange: (datetime: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimeRangePicker({
  startDateTime,
  endDateTime,
  onStartDateTimeChange,
  onEndDateTimeChange,
  error,
  className,
  disabled,
}: DateTimeRangePickerProps) {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <DateTimePicker
        value={startDateTime}
        onChange={(e) => onStartDateTimeChange(e.target.value)}
        error={error}
        disabled={disabled}
        max={endDateTime}
      />
      <span className="text-sm text-gray-500 dark:text-gray-400">to</span>
      <DateTimePicker
        value={endDateTime}
        onChange={(e) => onEndDateTimeChange(e.target.value)}
        error={error}
        disabled={disabled}
        min={startDateTime}
      />
    </div>
  );
} 
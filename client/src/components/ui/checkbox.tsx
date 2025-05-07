import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="relative">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-gray-200 text-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-400',
              error && 'border-red-500 focus:ring-red-500 dark:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {label && (
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {label}
            </span>
          )}
        </label>
        {error && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

interface CheckboxGroupProps {
  options: { value: string; label: string }[];
  value?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function CheckboxGroup({
  options,
  value = [],
  onChange,
  error,
  className,
  disabled,
}: CheckboxGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          value={value.includes(option.value)}
          onChange={onChange}
          label={option.label}
          error={error}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

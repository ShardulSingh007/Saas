import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  error?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, error, label, checked, ...props }, ref) => {
    return (
      <div className="relative">
        <label className="flex items-center space-x-2">
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={checked}
              ref={ref}
              {...props}
            />
            <div
              className={cn(
                'pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-blue-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 dark:bg-gray-800 dark:peer-focus:ring-blue-400',
                error && 'peer-focus:ring-red-500'
              )}
            />
          </div>
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
Switch.displayName = 'Switch';

interface SwitchGroupProps {
  options: { value: string; label: string }[];
  value?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function SwitchGroup({
  options,
  value = [],
  onChange,
  error,
  className,
  disabled
}: SwitchGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option) => (
        <Switch
          key={option.value}
          checked={value.includes(option.value)}
          onChange={onChange}
          label={option.label}
          error={error}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

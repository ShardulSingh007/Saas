import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="flex items-center space-x-4">
          <input
            type="color"
            className={cn(
              'h-10 w-20 cursor-pointer rounded-md border border-gray-200 bg-white p-1 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-800 dark:focus-visible:ring-blue-400',
              error && 'border-red-500 focus-visible:ring-red-500 dark:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {props.value || '#000000'}
          </span>
        </div>
        {error && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </div>
        )}
      </div>
    );
  }
);
ColorPicker.displayName = 'ColorPicker';

interface ColorPresetsProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  disabled?: boolean;
}

export function ColorPresets({
  value,
  onChange,
  presets = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
  ],
  disabled,
}: ColorPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            'h-6 w-6 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:focus:ring-blue-400',
            value === color && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-blue-400'
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

interface ColorPickerWithPresetsProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function ColorPickerWithPresets({
  value,
  onChange,
  presets,
  className,
  error,
  disabled,
}: ColorPickerWithPresetsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <ColorPicker
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        disabled={disabled}
      />
      <ColorPresets
        value={value}
        onChange={onChange}
        presets={presets}
        disabled={disabled}
      />
    </div>
  );
} 
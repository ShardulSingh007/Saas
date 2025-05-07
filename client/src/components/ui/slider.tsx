import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, error, min = 0, max = 100, step = 1, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          className={cn(
            'h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700',
            '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:hover:bg-blue-600 dark:[&::-webkit-slider-thumb]:bg-blue-400 dark:[&::-webkit-slider-thumb]:hover:bg-blue-500',
            '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:transition-colors [&::-moz-range-thumb]:hover:bg-blue-600 dark:[&::-moz-range-thumb]:bg-blue-400 dark:[&::-moz-range-thumb]:hover:bg-blue-500',
            '[&::-ms-thumb]:h-4 [&::-ms-thumb]:w-4 [&::-ms-thumb]:appearance-none [&::-ms-thumb]:rounded-full [&::-ms-thumb]:border-0 [&::-ms-thumb]:bg-blue-500 [&::-ms-thumb]:transition-colors [&::-ms-thumb]:hover:bg-blue-600 dark:[&::-ms-thumb]:bg-blue-400 dark:[&::-ms-thumb]:hover:bg-blue-500',
            error && '[&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:hover:bg-red-600 dark:[&::-webkit-slider-thumb]:bg-red-400 dark:[&::-webkit-slider-thumb]:hover:bg-red-500 [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:hover:bg-red-600 dark:[&::-moz-range-thumb]:bg-red-400 dark:[&::-moz-range-thumb]:hover:bg-red-500 [&::-ms-thumb]:bg-red-500 [&::-ms-thumb]:hover:bg-red-600 dark:[&::-ms-thumb]:bg-red-400 dark:[&::-ms-thumb]:hover:bg-red-500',
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
Slider.displayName = 'Slider';

interface SliderRangeProps {
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

export function SliderRange({
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
}: SliderRangeProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <Slider
        value={startValue}
        onChange={(e) => onStartValueChange(Number(e.target.value))}
        error={error}
        disabled={disabled}
        max={endValue}
        min={min}
        step={step}
      />
      <Slider
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

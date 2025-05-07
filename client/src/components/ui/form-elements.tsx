import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
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
Input.displayName = 'Input';

export const FormLabel = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

export function ErrorMessage({ children, className }: ErrorMessageProps) {
  return (
    <p
      className={cn(
        'mt-1 text-sm text-red-500 dark:text-red-400',
        className
      )}
    >
      {children}
    </p>
  );
}

export function FormGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
}

export function FormDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-sm text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {children}
    </p>
  );
} 
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface UrlInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UrlInput = forwardRef<HTMLInputElement, UrlInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="relative">
          <input
            type="url"
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400',
              error && 'border-red-500 focus-visible:ring-red-500 dark:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </div>
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
UrlInput.displayName = 'UrlInput'; 
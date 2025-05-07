import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, error, onSearch, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="relative">
          <input
            type="search"
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          {onSearch && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onSearch}
            >
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
                  d="M6 12L4.5 10.5m0 0l3-3m-3 3l3 3m13.5-3L19.5 10.5m0 0l-3-3m3 3l-3 3"
                />
              </svg>
            </button>
          )}
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
SearchInput.displayName = 'SearchInput'; 
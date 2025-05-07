import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, error, accept, multiple, label = 'Choose file', ...props }, ref) => {
    return (
      <div className="relative">
        <div className="flex items-center space-x-4">
          <label
            className={cn(
              'flex h-10 cursor-pointer items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
              error && 'border-red-500 text-red-500 dark:border-red-500 dark:text-red-500'
            )}
          >
            {label}
            <input
              type="file"
              className="hidden"
              accept={accept}
              multiple={multiple}
              ref={ref}
              {...props}
            />
          </label>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {props.value ? 'File selected' : 'No file chosen'}
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
FileInput.displayName = 'FileInput'; 
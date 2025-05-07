import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  trigger,
  children,
  align = 'left',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[8rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800',
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  className,
  disabled = false,
}: DropdownItemProps) {
  return (
    <button
      className={cn(
        'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 border-t border-gray-200 dark:border-gray-700" />;
}

export function DropdownLabel({ children, className }: DropdownItemProps) {
  return (
    <div
      className={cn(
        'px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {children}
    </div>
  );
} 
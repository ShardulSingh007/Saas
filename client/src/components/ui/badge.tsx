import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  rounded = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-0.5 text-sm',
        size === 'lg' && 'px-3 py-1 text-base',
        rounded && 'rounded-full',
        !rounded && 'rounded-md',
        variant === 'default' && 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        variant === 'primary' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        variant === 'success' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        variant === 'warning' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        variant === 'danger' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        variant === 'info' && 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
        className
      )}
      {...props}
    />
  );
}

interface BadgeGroupProps {
  badges: { label: string; variant?: BadgeProps['variant'] }[];
  size?: BadgeProps['size'];
  rounded?: boolean;
  className?: string;
}

export function BadgeGroup({
  badges,
  size = 'md',
  rounded = false,
  className,
}: BadgeGroupProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.map((badge) => (
        <Badge
          key={badge.label}
          variant={badge.variant}
          size={size}
          rounded={rounded}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}

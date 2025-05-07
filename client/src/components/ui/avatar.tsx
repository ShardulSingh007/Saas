"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { useState } from 'react'

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ src, alt, size = 'md', fallback, status, className, ...props }, ref) => {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <AvatarPrimitive.Fallback
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground"
          )}
        >
          {fallback ? getInitials(fallback) : '?'}
        </AvatarPrimitive.Fallback>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800',
            statusClasses[status]
          )}
        />
      )}
    </AvatarPrimitive.Root>
  );
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

interface AvatarGroupProps {
  avatars: {
    src?: string;
    alt?: string;
    fallback?: string;
    status?: AvatarProps['status'];
  }[];
  size?: AvatarProps['size'];
  max?: number;
  className?: string;
}

const AvatarGroup = ({
  avatars,
  size = 'md',
  max = 5,
  className,
}: AvatarGroupProps) => {
  const displayedAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayedAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          status={avatar.status}
          size={size}
          className="ring-2 ring-white dark:ring-gray-800"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600 ring-2 ring-white dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-800',
            size === 'sm' && 'h-8 w-8 text-xs',
            size === 'md' && 'h-10 w-10 text-sm',
            size === 'lg' && 'h-12 w-12 text-base',
            size === 'xl' && 'h-16 w-16 text-lg'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup }

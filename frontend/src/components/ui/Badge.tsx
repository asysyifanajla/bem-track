import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'maroon' | 'cream' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const VARIANTS = {
  default: 'bg-[#FAF7F1] text-[#352A28] border-[#E8E0D7]',
  maroon: 'bg-[#F5EEF0] text-[#6E2639] border-[#6E2639]/25',
  cream: 'bg-[#F3EBDD]/60 text-[#352A28] border-[#E8E0D7]',
  success: 'bg-[#EDF7F1] text-[#2D7A4F] border-[#2D7A4F]/25',
  warning: 'bg-[#FEF8ED] text-[#92600C] border-[#92600C]/25',
  danger: 'bg-[#FDF0F1] text-[#9B2335] border-[#9B2335]/25',
  info: 'bg-[#EDF4FA] text-[#1A5F8A] border-[#1A5F8A]/25',
};

const DOT_COLORS = {
  default: 'bg-[#8A817B]',
  maroon: 'bg-[#6E2639]',
  cream: 'bg-[#B5AAA5]',
  success: 'bg-[#2D7A4F]',
  warning: 'bg-[#92600C]',
  danger: 'bg-[#9B2335]',
  info: 'bg-[#1A5F8A]',
};

export default function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
        VARIANTS[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', DOT_COLORS[variant])} />
      )}
      {children}
    </span>
  );
}

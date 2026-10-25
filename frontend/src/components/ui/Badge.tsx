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
  default: 'bg-[#FAF7F5] text-[#22161A] border-[#EFE8E2]',
  maroon: 'bg-[#FAF0F3] text-[#4E1724] border-[#4E1724]/20',
  cream: 'bg-[#FBF6F0] text-[#756C69] border-[#EFE8E2]',
  success: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]/60',
  warning: 'bg-[#FEF7EC] text-[#B45309] border-[#FDE68A]/60',
  danger: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]/60',
  info: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]/60',
};

const DOT_COLORS = {
  default: 'bg-[#756C69]',
  maroon: 'bg-[#4E1724]',
  cream: 'bg-[#A39893]',
  success: 'bg-[#059669]',
  warning: 'bg-[#B45309]',
  danger: 'bg-[#DC2626]',
  info: 'bg-[#6D28D9]',
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
        size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-xs',
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

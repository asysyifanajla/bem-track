import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANTS = {
  primary:
    'bg-[#4E1724] hover:bg-[#380C1B] text-white shadow-xs border border-[#4E1724] hover:border-[#380C1B] focus-visible:ring-2 focus-visible:ring-[#4E1724]/30',
  secondary:
    'bg-white hover:bg-[#FAF7F5] text-[#22161A] border border-[#EFE8E2] shadow-xs focus-visible:ring-2 focus-visible:ring-[#4E1724]/20',
  outline:
    'bg-white hover:bg-[#FAF0F3] text-[#4E1724] border border-[#4E1724]/30 hover:border-[#4E1724] focus-visible:ring-2 focus-visible:ring-[#4E1724]/20',
  ghost:
    'bg-transparent hover:bg-[#FAF0F3] text-[#22161A] hover:text-[#4E1724] border border-transparent',
  danger:
    'bg-[#DC2626] hover:bg-[#B91C1C] text-white border border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#DC2626]/30',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-xl font-medium',
  md: 'px-4.5 py-2 text-sm gap-2 rounded-2xl font-semibold',
  lg: 'px-6 py-2.5 text-sm gap-2.5 rounded-2xl font-semibold',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none active:scale-[0.99]',
        'disabled:opacity-55 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}

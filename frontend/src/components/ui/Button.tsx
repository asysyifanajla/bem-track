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
    'bg-[#6E2639] hover:bg-[#4B1828] text-white shadow-xs border border-[#6E2639] hover:border-[#4B1828] focus-visible:ring-2 focus-visible:ring-[#6E2639]/30',
  secondary:
    'bg-[#FAF7F1] hover:bg-[#F3EBDD] text-[#352A28] border border-[#E8E0D7] focus-visible:ring-2 focus-visible:ring-[#6E2639]/20',
  outline:
    'bg-white hover:bg-[#FAF7F1] text-[#6E2639] border border-[#6E2639]/40 hover:border-[#6E2639] focus-visible:ring-2 focus-visible:ring-[#6E2639]/20',
  ghost:
    'bg-transparent hover:bg-[#F5EEF0] text-[#352A28] hover:text-[#6E2639] border border-transparent',
  danger:
    'bg-[#9B2335] hover:bg-[#7D1B2A] text-white border border-[#9B2335] focus-visible:ring-2 focus-visible:ring-[#9B2335]/30',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md font-medium',
  md: 'px-4 py-2 text-sm gap-2 rounded-lg font-medium',
  lg: 'px-5 py-2.5 text-sm gap-2.5 rounded-lg font-semibold',
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

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#352A28] tracking-tight">
            {label}
            {props.required && <span className="text-[#9B2335] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#8A817B] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-white border border-[#E8E0D7] text-[#352A28] placeholder-[#8A817B]/60 text-sm rounded-lg py-2 px-3 transition-colors',
              'focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15',
              'disabled:bg-[#FAF7F1] disabled:text-[#8A817B] disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : undefined,
              rightIcon ? 'pr-9' : undefined,
              error ? 'border-[#9B2335] focus:border-[#9B2335] focus:ring-[#9B2335]/15' : undefined,
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#8A817B] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#9B2335] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8A817B]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

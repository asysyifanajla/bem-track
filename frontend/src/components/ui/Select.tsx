import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, children, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#352A28] tracking-tight">
            {label}
            {props.required && <span className="text-[#9B2335] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-white border border-[#E8E0D7] text-[#352A28] text-sm rounded-lg py-2 pl-3 pr-8 transition-colors appearance-none cursor-pointer',
              'focus:outline-hidden focus:border-[#6E2639] focus:ring-2 focus:ring-[#6E2639]/15',
              'disabled:bg-[#FAF7F1] disabled:text-[#8A817B] disabled:cursor-not-allowed',
              error && 'border-[#9B2335] focus:border-[#9B2335] focus:ring-[#9B2335]/15',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="absolute right-2.5 w-4 h-4 text-[#8A817B] pointer-events-none" />
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

Select.displayName = 'Select';
export default Select;

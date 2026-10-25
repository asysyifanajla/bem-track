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
          <label htmlFor={selectId} className="block text-xs font-bold text-[#22161A] tracking-tight">
            {label}
            {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-white border border-[#EFE8E2] text-[#22161A] text-sm rounded-2xl py-2.5 pl-3.5 pr-9 transition-colors appearance-none cursor-pointer shadow-2xs',
              'focus:outline-hidden focus:border-[#4E1724] focus:ring-2 focus:ring-[#4E1724]/15',
              'disabled:bg-[#FAF7F5] disabled:text-[#A39893] disabled:cursor-not-allowed',
              error && 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15',
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
          <ChevronDown className="absolute right-3 w-4 h-4 text-[#756C69] pointer-events-none" />
        </div>
        {error ? (
          <p className="text-xs text-[#DC2626] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#756C69]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

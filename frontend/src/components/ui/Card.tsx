import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-7 sm:p-8' };
  return (
    <div
      className={cn(
        'bg-white border border-[#EFE8E2] rounded-3xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] transition-colors',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, icon, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4 pb-3.5 border-b border-[#EFE8E2]', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-9 h-9 rounded-2xl bg-[#FAF0F3] text-[#4E1724] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-[#22161A] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[#756C69] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
}: StatCardProps) {
  const changeColors = {
    positive: 'text-[#059669] bg-[#ECFDF5]',
    negative: 'text-[#DC2626] bg-[#FEF2F2]',
    neutral: 'text-[#756C69] bg-[#FAF7F5]',
  };

  return (
    <div className="bg-white border border-[#EFE8E2] rounded-3xl p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#756C69] uppercase tracking-wider">{title}</span>
        <div className="w-10 h-10 rounded-2xl bg-[#FBF6F0] text-[#8B263E] border border-[#F2ECE4] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#22161A] tracking-tight">{value}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {change && (
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', changeColors[changeType])}>
              {change}
            </span>
          )}
          {description && <span className="text-xs text-[#756C69]">{description}</span>}
        </div>
      </div>
    </div>
  );
}

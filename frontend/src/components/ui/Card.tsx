import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-3.5', md: 'p-5', lg: 'p-6' };
  return (
    <div
      className={cn(
        'bg-white border border-[#E8E0D7] rounded-lg transition-colors',
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
    <div className={cn('flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#E8E0D7]', className)}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className="w-7 h-7 rounded-md bg-[#F5EEF0] text-[#6E2639] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[#352A28]">{title}</h3>
          {subtitle && <p className="text-xs text-[#8A817B] mt-0.5">{subtitle}</p>}
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
    positive: 'text-[#2D7A4F] bg-[#EDF7F1]',
    negative: 'text-[#9B2335] bg-[#FDF0F1]',
    neutral: 'text-[#8A817B] bg-[#FAF7F1]',
  };

  return (
    <div className="bg-white border border-[#E8E0D7] rounded-lg p-4.5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#8A817B] uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-md bg-[#FAF7F1] text-[#6E2639] border border-[#E8E0D7] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#352A28] tracking-tight">{value}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {change && (
            <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-sm', changeColors[changeType])}>
              {change}
            </span>
          )}
          {description && <span className="text-xs text-[#8A817B]">{description}</span>}
        </div>
      </div>
    </div>
  );
}

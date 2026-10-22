import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'maroon' | 'emerald' | 'amber' | 'rose' | 'slate';
  showValue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const COLORS = {
  maroon: 'bg-[#6E2639]',
  emerald: 'bg-[#2D7A4F]',
  amber: 'bg-[#92600C]',
  rose: 'bg-[#9B2335]',
  slate: 'bg-[#8A817B]',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  color = 'maroon',
  showValue = true,
  size = 'sm',
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1">
          <div>
            {label && <span className="text-xs font-semibold text-[#352A28]">{label}</span>}
            {sublabel && <p className="text-[11px] text-[#8A817B]">{sublabel}</p>}
          </div>
          {showValue && (
            <span className="text-xs font-mono font-medium text-[#8A817B]">{pct.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-[#E8E0D7] rounded-full overflow-hidden', size === 'md' ? 'h-2' : 'h-1.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', COLORS[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

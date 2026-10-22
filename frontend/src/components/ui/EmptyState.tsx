import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-[#E8E0D7] bg-[#FAF7F1]/40',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#FAF7F1] border border-[#E8E0D7] flex items-center justify-center text-[#8A817B] mb-3">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <h4 className="text-sm font-semibold text-[#352A28] mb-1">{title}</h4>
      <p className="text-xs text-[#8A817B] max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

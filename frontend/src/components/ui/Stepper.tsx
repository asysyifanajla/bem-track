import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

export type StepStatus = 'completed' | 'active' | 'pending' | 'rejected';

export interface Step {
  id: string;
  label: string;
  sublabel?: string;
  status: StepStatus;
  timestamp?: string;
  actor?: string;
}

export interface StepperProps {
  steps: Step[];
  className?: string;
}

export default function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn('flex items-start w-full', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-start flex-1 min-w-0">
            {/* Step node */}
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                  step.status === 'completed' && 'bg-[#EDF7F1] text-[#2D7A4F] border-[#2D7A4F]/30',
                  step.status === 'active' && 'bg-[#F5EEF0] text-[#6E2639] border-[#6E2639]',
                  step.status === 'pending' && 'bg-[#FAF7F1] text-[#8A817B] border-[#E8E0D7]',
                  step.status === 'rejected' && 'bg-[#FDF0F1] text-[#9B2335] border-[#9B2335]/30'
                )}
              >
                {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-[#2D7A4F]" />}
                {step.status === 'active' && <Clock className="w-4 h-4 text-[#6E2639]" />}
                {step.status === 'pending' && <Circle className="w-3.5 h-3.5 text-[#8A817B]" />}
                {step.status === 'rejected' && <AlertCircle className="w-4 h-4 text-[#9B2335]" />}
              </div>

              {/* Labels below */}
              <div className="mt-2 text-center px-1">
                <p
                  className={cn(
                    'text-xs font-semibold leading-tight truncate',
                    step.status === 'completed' && 'text-[#2D7A4F]',
                    step.status === 'active' && 'text-[#6E2639]',
                    step.status === 'pending' && 'text-[#8A817B]',
                    step.status === 'rejected' && 'text-[#9B2335]'
                  )}
                >
                  {step.label}
                </p>
                {step.sublabel && (
                  <p className="text-[11px] text-[#8A817B] mt-0.5 leading-tight">{step.sublabel}</p>
                )}
                {step.timestamp && step.status !== 'pending' && (
                  <p className="text-[10px] text-[#8A817B] mt-0.5">{step.timestamp}</p>
                )}
                {step.actor && step.status !== 'pending' && (
                  <p className="text-[11px] font-medium text-[#352A28] mt-0.5">{step.actor}</p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex-1 mt-4 mx-2">
                <div
                  className={cn(
                    'h-0.5 w-full',
                    step.status === 'completed' ? 'bg-[#2D7A4F]' : 'bg-[#E8E0D7]'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

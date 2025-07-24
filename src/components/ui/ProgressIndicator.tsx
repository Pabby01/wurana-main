import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  className
}) => {
  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  index < currentStep
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : index === currentStep
                    ? 'bg-purple-100 border-purple-600 text-purple-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                )}
                whileHover={{ scale: 1.05 }}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </motion.div>
              <div className="mt-2 text-center">
                <div className={clsx(
                  'text-sm font-medium',
                  index <= currentStep ? 'text-purple-600' : 'text-gray-400'
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-20">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={clsx(
                'flex-1 h-0.5 mx-4 transition-all duration-300',
                index < currentStep ? 'bg-purple-600' : 'bg-gray-300'
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
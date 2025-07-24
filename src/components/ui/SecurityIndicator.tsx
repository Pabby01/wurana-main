import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

interface SecurityIndicatorProps {
  level: 'low' | 'medium' | 'high';
  score: number;
  className?: string;
}

export const SecurityIndicator: React.FC<SecurityIndicatorProps> = ({
  level,
  score,
  className
}) => {
  const getConfig = () => {
    switch (level) {
      case 'low':
        return {
          icon: ShieldAlert,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          label: 'Basic Security',
          description: 'Complete more steps to improve security'
        };
      case 'medium':
        return {
          icon: Shield,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          label: 'Good Security',
          description: 'Your account is reasonably secure'
        };
      case 'high':
        return {
          icon: ShieldCheck,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          label: 'Excellent Security',
          description: 'Your account is highly secure'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        'p-4 rounded-lg border',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <Icon className={clsx('w-6 h-6', config.color)} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-900">{config.label}</span>
            <span className="text-sm font-semibold text-gray-600">{score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className={clsx(
                'h-2 rounded-full',
                level === 'low' ? 'bg-red-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              )}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
      </div>
    </motion.div>
  );
};
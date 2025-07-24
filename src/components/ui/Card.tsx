import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  gradient = false
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      className={clsx(
        'rounded-xl shadow-md transition-all duration-300',
        gradient 
          ? 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20'
          : 'bg-white border border-gray-200',
        hover && 'hover:shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
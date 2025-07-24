import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
  blur?: string;
  hover?: boolean;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  opacity = 0.15,
  blur = 'backdrop-blur-md',
  hover = false
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      className={clsx(
        'rounded-xl border border-white/20 shadow-xl transition-all duration-300',
        blur,
        className
      )}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </motion.div>
  );
};
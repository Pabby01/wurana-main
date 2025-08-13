import React, { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

type NeonButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  glowColor?: string;
  children: React.ReactNode;
};

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  glowColor,
  disabled,
  children,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-purple-600 to-purple-700",
      text: "text-white",
      glow: glowColor || "#9945FF",
      border: "border-purple-500/50",
    },
    secondary: {
      bg: "bg-gradient-to-r from-indigo-900 to-indigo-800",
      text: "text-white",
      glow: glowColor || "#2E1A47",
      border: "border-indigo-500/50",
    },
    accent: {
      bg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
      text: "text-gray-900",
      glow: glowColor || "#FFC107",
      border: "border-yellow-400/50",
    },
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={clsx(
        baseClasses,
        currentVariant.bg,
        currentVariant.text,
        sizes[size],
        `border ${currentVariant.border}`,
        className
      )}
      style={{
        boxShadow: isHovered
          ? `0 0 30px ${currentVariant.glow}40, 0 0 60px ${currentVariant.glow}20`
          : `0 0 15px ${currentVariant.glow}20`,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(45deg, ${currentVariant.glow}20, transparent, ${currentVariant.glow}20)`,
        }}
      />

      {/* Loading spinner */}
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}

      {/* Button content */}
      <span className="relative z-10">{children}</span>

      {/* Click ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: currentVariant.glow }}
      />
    </motion.button>
  );
};

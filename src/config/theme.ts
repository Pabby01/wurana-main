export const theme = {
  colors: {
    primary: '#9945FF',      // Solana purple
    secondary: '#2E1A47',    // Deep Yoruba indigo
    accent: '#FFC107',       // Gold highlights
    neutralLight: '#F5F5F5', // Backgrounds, cards
    neutralDark: '#333333',  // Body text
    white: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #9945FF 0%, #2E1A47 100%)',
    gold: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(153, 69, 255, 0.3)'
  }
} as const;
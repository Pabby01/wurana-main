import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Menu, X, LogOut } from 'lucide-react';
import { NeonButton } from '../ui/NeonButton';
import { GlassmorphicCard } from '../ui/GlassmorphicCard';
import { Input } from '../ui/Input';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, authenticated: isAuthenticated, logout } = useAuth();
  const { scrollPosition } = useScrollPosition();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      try {
        await logout();
      } catch (error) {
        console.error('Error logging out:', error);
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const headerOpacity = Math.min(scrollPosition / 100, 0.95);
  const headerScale = Math.max(1 - scrollPosition / 2000, 0.95);
  const shouldShrink = scrollPosition > 50;

  const navItems = [
    { label: 'Browse Services', path: '/marketplace' },
    { label: 'Find Jobs', path: '/jobs' },
    { label: 'How it Works', path: '/how-it-works' }
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: `rgba(153, 69, 255, ${0.05 + headerOpacity * 0.9})`,
          backdropFilter: `blur(${8 + scrollPosition / 10}px)`,
          WebkitBackdropFilter: `blur(${8 + scrollPosition / 10}px)`,
          borderRadius: shouldShrink ? '0 0 1.5rem 1.5rem' : '0',
          boxShadow: shouldShrink 
            ? '0 4px 20px rgba(153, 69, 255, 0.2)' 
            : 'none',
        }}
        animate={{ 
          scale: headerScale,
          y: shouldShrink ? -10 : 0
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between transition-all duration-300"
            animate={{ height: shouldShrink ? '60px' : '64px' }}
          >
            {/* Logo */}
            <Link to="/">
              <motion.div 
                className="flex items-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="relative w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                  whileHover={{ 
                    boxShadow: '0 0 20px rgba(255, 193, 7, 0.5)',
                    rotate: 5
                  }}
                >
                  <img 
                    src="/logo.png" 
                    alt="Wurana Logo"
                    className="w-8 h-8 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                <span className="text-white font-bold text-xl">Wurana</span>
              </motion.div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-white/90 hover:text-white transition-colors relative ${
                    location.pathname === item.path ? 'text-yellow-400' : ''
                  }`}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              ))}
            </nav>

            {/* Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search services..."
                  icon={<Search className="w-4 h-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </form>
              
              {isAuthenticated && user ? (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm">{user.name}</span>
                  </div>
                  <NeonButton
                    variant="accent"
                    size="sm"
                    onClick={handleAuthAction}
                  >
                    <LogOut className="w-4 h-4" />
                  </NeonButton>
                </motion.div>
              ) : (
                <NeonButton
                  variant="accent"
                  size="sm"
                  onClick={handleAuthAction}
                >
                  <User className="w-4 h-4" />
                  <span>Sign Up</span>
                </NeonButton>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t border-white/20"
            >
              <GlassmorphicCard className="space-y-4 p-4" opacity={0.1}>
                <div>
                  <Input
                    placeholder="Search services, artisans, or jobs..."
                    icon={<Search className="w-4 h-4" />}
                    className="bg-transparent border-white/20 text-white placeholder-white/70"
                  />
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block text-white/90 hover:text-white py-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="block"
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  ))}
                </nav>
                <div className="pt-4 border-t border-white/20">
                  {!isAuthenticated && (
                    <NeonButton
                      variant="accent"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign Up</span>
                    </NeonButton>
                  )}
                </div>
              </GlassmorphicCard>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
};
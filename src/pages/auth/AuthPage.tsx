import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GlassmorphicCard } from '../../components/ui/GlassmorphicCard';
import { AuthForm } from '../../components/auth/AuthForm';

type AuthMode = 'login' | 'signup';

export const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900 px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <GlassmorphicCard className="p-8">
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                authMode === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                authMode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={authMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900">
                {authMode === 'login' ? 'Welcome Back' : 'Welcome to Wurana'}
              </h1>
              <p className="mt-2 text-white">
                {authMode === 'login' 
                  ? 'Sign in to your account' 
                  : 'Connect with skilled artisans'
                }
              </p>
            </motion.div>
          </AnimatePresence>
          
          {/* Auth Form */}
          <AuthForm mode={authMode} />

          {/* Mode Switch Link */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleAuthMode}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {authMode === 'login' 
                ? "Don't have an account? Create one" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </GlassmorphicCard>

        {/* Additional info */}
        <div className="mt-8 text-center text-white/80">
          <p>By continuing, you agree to our</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              Terms of Service
            </a>
            <span>&middot;</span>
            <a href="/privacy" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
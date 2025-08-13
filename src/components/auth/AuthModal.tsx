/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GlassmorphicCard } from '../ui/GlassmorphicCard';
import { useGateway } from '@civic/solana-gateway-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle } = useAuth();
  const { requestGatewayToken } = useGateway();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCivicVerification = async () => {
    setIsLoading(true);
    try {
      if (requestGatewayToken) {
        await requestGatewayToken();
        await login(email, name);
        onClose();
      } else {
        setFormError('Civic verification is not available. Please try again later.');
      }
    } catch (error) {
      setFormError('Civic verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !name) {
      setFormError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    await handleCivicVerification();
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      setFormError('Google login failed. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <GlassmorphicCard className="w-[90vw] max-w-md p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Error Display */}
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{formError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<UserIcon className="w-5 h-5" />}
                  placeholder="Enter your name"
                  disabled={isLoading}
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign up with Google
              </Button>

              {/* Terms */}
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Privacy Policy
                </a>
              </p>
            </GlassmorphicCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
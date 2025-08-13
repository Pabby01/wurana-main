import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useGateway } from '@civic/solana-gateway-react';

export const AuthForm: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { requestGatewayToken } = useGateway();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleCivicVerification = async () => {
    setIsLoading(true);
    try {
      if (requestGatewayToken) {
        await requestGatewayToken();
        await login(email, name);
      } else {
        setFormError('Civic verification is not available. Please try again later.');
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      setFormError(`Civic verification failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      setFormError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {formError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{formError}</p>
        </motion.div>
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

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5 mr-2"
        />
        Sign up with Google
      </Button>
    </div>
  );
};
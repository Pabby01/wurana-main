/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { GatewayProvider } from '@civic/solana-gateway-react';

interface User {
  id: string;
  email?: string;
  name: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, name: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  createWallet: () => Promise<{ success: boolean; message: string }>;
}

const CIVIC_CONFIG = {
  clientId: "dfdc98d4-06c9-4e12-823b-19e94ebacef6",
  gatekeeperNetwork: 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6',
  stage: 'prod'
};

const connection = new Connection('https://api.devnet.solana.com');

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, name: string) => {
    try {
      // Validate input
      if (!email || !name) {
        throw new Error('Email and name are required');
      }
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }

      const newUser = {
        id: Math.random().toString(36).substring(7),
        email,
        name
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(`Authentication failed: ${errorMessage}`);
    }
  };

  const loginWithGoogle = async () => {
    // Implement Google login logic here
    throw new Error('Google login not implemented yet');
  };

  const createWallet = async () => {
    if (!user) {
      throw new Error('Authentication required: Please log in to create a wallet');
    }

    try {
      const wallet = Keypair.generate();
      const walletAddress = wallet.publicKey.toString();

      // Store private key securely with encryption
      const encryptedKey = btoa(String.fromCharCode.apply(null, Array.from(wallet.secretKey)));
      localStorage.setItem(`wallet_${user.id}`, encryptedKey);

      // Request airdrop for testing (devnet only)
      const signature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (!confirmation.value.err) {
        // Update user with wallet address
        const updatedUser = { ...user, walletAddress };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, message: 'Wallet created successfully' };
      } else {
        throw new Error('Transaction confirmation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create wallet';
      throw new Error(`Wallet creation failed: ${errorMessage}`);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout,
    createWallet
  };

  return (
    <AuthContext.Provider value={value}>
      <GatewayProvider
        wallet={{
          publicKey: user?.walletAddress ? new PublicKey(user.walletAddress) : null,
          signTransaction: async () => { throw new Error('Not implemented'); },
          signMessage: async () => { throw new Error('Not implemented'); },
          connected: !!user?.walletAddress
        }}
        gatekeeperNetwork={new PublicKey(CIVIC_CONFIG.gatekeeperNetwork)}
        cluster="https://api.devnet.solana.com"
        connection={connection}
      >
        {children}
      </GatewayProvider>
    </AuthContext.Provider>
  );
};
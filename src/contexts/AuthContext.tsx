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
  login: (email: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  createWallet: () => Promise<void>;
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
    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      name
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const loginWithGoogle = async () => {
    // Implement Google login logic here
    throw new Error('Google login not implemented yet');
  };

  const createWallet = async () => {
    if (!user) throw new Error('User must be logged in to create a wallet');

    const wallet = Keypair.generate();
    const walletAddress = wallet.publicKey.toString();

    // Store private key securely
    localStorage.setItem(`wallet_${user.id}`, JSON.stringify(Array.from(wallet.secretKey)));

    // Request airdrop for testing (devnet only)
    try {
      const signature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature);
    } catch (error) {
      console.error('Failed to request airdrop:', error);
    }

    // Update user with wallet address
    const updatedUser = { ...user, walletAddress };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
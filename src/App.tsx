import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { FeaturedServices } from './components/home/FeaturedServices';
import { Categories } from './components/home/Categories';
import { HowItWorks } from './components/home/HowItWorks';
import { ServiceGrid } from './components/marketplace/ServiceGrid';
import { KYCFlow } from './components/auth/KYCFlow';
import { ChatInterface } from './components/ui/ChatInterface';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';

// Solana wallet adapter imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Required for Solana wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  // Configure Solana network connection
  const network = clusterApiUrl('devnet');
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <AuthProvider>
              <div className="min-h-screen bg-white overflow-x-hidden">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <FeaturedServices />
              <Categories />
              <HowItWorks />
            </>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <ServiceGrid />
            </ProtectedRoute>
          } />
          <Route path="/kyc" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
                <KYCFlow onComplete={() => <Navigate to="/" />} />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                  <ChatInterface
                    messages={[]}
                    currentUserId="current"
                    onSendMessage={(content) => console.log('Send:', content)}
                    onlineStatus={true}
                    isTyping={false}
                    className="h-96"
                  />
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardOverview />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
              </div>
            </AuthProvider>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
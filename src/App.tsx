import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/home/Hero";
import { FeaturedServices } from "./components/home/FeaturedServices";
import { Categories } from "./components/home/Categories";
import { HowItWorks } from "./components/home/HowItWorks";
import { ServiceGrid } from "./components/marketplace/ServiceGrid";
import { KYCFlow } from "./components/auth/KYCFlow";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { DashboardOverview } from "./components/dashboard/DashboardOverview";
import { AuthPage } from "./pages/auth/AuthPage";
import { WalletPage } from "./pages/wallet/WalletPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { ReviewsPage } from "./pages/reviews/ReviewsPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { CreateGigPage } from "./pages/gigs/CreateGigPage";
import { ManageGigsPage } from "./pages/gigs/ManageGigsPage";
import { GigDetailPage } from "./pages/gigs/GigDetailPage";
import { GigOrdersPage } from "./pages/gigs/GigOrdersPage";
import { GigAnalyticsPage } from "./pages/gigs/GigAnalyticsPage";

// New job and bidding system pages
import { PostJobPage } from "./pages/jobs/PostJobPage";
import { BrowseJobsPage } from "./pages/jobs/BrowseJobsPage";
import { JobDetailPage } from "./pages/jobs/JobDetailPage";
import { BidManagementPage } from "./pages/bids/BidManagementPage";
import { ChatPage } from "./pages/chat/ChatPage";

// Solana wallet adapter imports
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Required for Solana wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  // Configure Solana network connection
  const network = clusterApiUrl("devnet");
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
                  <Route
                    path="/"
                    element={
                      <>
                        <Hero />
                        <FeaturedServices />
                        <Categories />
                        <HowItWorks />
                      </>
                    }
                  />
                  <Route
                    path="/marketplace"
                    element={
                      <ProtectedRoute>
                        <ServiceGrid />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/kyc"
                    element={
                      <ProtectedRoute>
                        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
                          <KYCFlow onComplete={() => <Navigate to="/" />} />
                        </div>
                      </ProtectedRoute>
                    }
                  />

                  {/* Job System Routes */}
                  <Route
                    path="/jobs"
                    element={
                      <ProtectedRoute>
                        <BrowseJobsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/post"
                    element={
                      <ProtectedRoute>
                        <PostJobPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/:jobId"
                    element={
                      <ProtectedRoute>
                        <JobDetailPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardOverview />} />
                    <Route path="wallet" element={<WalletPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="bids" element={<BidManagementPage />} />
                    <Route path="services" element={<FeaturedServices />} />

                    <Route path="gigs">
                      <Route path="create" element={<CreateGigPage />} />
                      <Route path="manage" element={<ManageGigsPage />} />
                      <Route path=":id" element={<GigDetailPage />} />
                      <Route path=":id/orders" element={<GigOrdersPage />} />
                      <Route
                        path=":id/analytics"
                        element={<GigAnalyticsPage />}
                      />
                    </Route>
                  </Route>

                  <Route path="/auth" element={<AuthPage />} />
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

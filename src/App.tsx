import { Suspense, lazy } from "react";
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

// Lazy load pages
const AuthPage = lazy(() => import("./pages/auth/AuthPage").then(module => ({ default: module.AuthPage })));
const WalletPage = lazy(() => import("./pages/wallet/WalletPage").then(module => ({ default: module.WalletPage })));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage").then(module => ({ default: module.SettingsPage })));
const ReviewsPage = lazy(() => import("./pages/reviews/ReviewsPage").then(module => ({ default: module.ReviewsPage })));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage").then(module => ({ default: module.ProfilePage })));
const CreateGigPage = lazy(() => import("./pages/gigs/CreateGigPage").then(module => ({ default: module.CreateGigPage })));
const ManageGigsPage = lazy(() => import("./pages/gigs/ManageGigsPage").then(module => ({ default: module.ManageGigsPage })));
const GigDetailPage = lazy(() => import("./pages/gigs/GigDetailPage").then(module => ({ default: module.GigDetailPage })));
const GigOrdersPage = lazy(() => import("./pages/gigs/GigOrdersPage").then(module => ({ default: module.GigOrdersPage })));
const GigAnalyticsPage = lazy(() => import("./pages/gigs/GigAnalyticsPage").then(module => ({ default: module.GigAnalyticsPage })));

// New job and bidding system pages
const PostJobPage = lazy(() => import("./pages/jobs/PostJobPage").then(module => ({ default: module.PostJobPage })));
const BrowseJobsPage = lazy(() => import("./pages/jobs/BrowseJobsPage").then(module => ({ default: module.BrowseJobsPage })));
const JobDetailPage = lazy(() => import("./pages/jobs/JobDetailPage").then(module => ({ default: module.JobDetailPage })));
const BidManagementPage = lazy(() => import("./pages/bids/BidManagementPage").then(module => ({ default: module.BidManagementPage })));
const ChatPage = lazy(() => import("./pages/chat/ChatPage").then(module => ({ default: module.ChatPage })));

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

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

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
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
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

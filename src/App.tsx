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

function App() {
  return (
    <Router>
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
          <Route path="/marketplace" element={<ServiceGrid />} />
          <Route path="/kyc" element={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
              <KYCFlow onComplete={() => <Navigate to="/" />} />
            </div>
          } />
          <Route path="/chat" element={
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
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
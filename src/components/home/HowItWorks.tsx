import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, MessageSquare, Shield, Star, Coins } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up with your email or Solana wallet and complete KYC verification",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Search,
    title: "Browse & Connect",
    description: "Find skilled artisans or post your service requirements",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: MessageSquare,
    title: "Negotiate & Agree",
    description: "Chat in real-time to discuss project details and pricing",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Secure Escrow",
    description: "Funds are locked in smart contract until work is completed",
    color: "from-teal-500 to-teal-600"
  },
  {
    icon: Star,
    title: "Complete & Review",
    description: "Receive your work and leave reviews to build reputation",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    icon: Coins,
    title: "Earn NFT Badges",
    description: "Outstanding artisans receive unique NFT badges for their achievements",
    color: "from-orange-500 to-orange-600"
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            How <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Wurana</span> Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            A seamless journey from discovery to delivery, powered by blockchain technology
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-4 z-0"></div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of artisans and clients who trust Wurana for secure, 
              transparent, and rewarding collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Start as Artisan
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-colors">
                Hire Talent
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
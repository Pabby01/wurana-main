import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Shield, Zap } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";
import { CSS3ParticleBackground } from "../ui/CSS3ParticleBackground";
import { Input } from "../ui/Input";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 overflow-hidden">
      {/* CSS3 Particle Background */}
      <CSS3ParticleBackground />

      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 rounded-lg backdrop-blur-sm"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-indigo-600/30 rounded-full backdrop-blur-sm"
          animate={{
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Empower
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Artisans
              </span>
              <br />
              on Solana
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Connect with skilled craftspeople, secure payments with blockchain
              technology, and build lasting relationships in the decentralized
              economy.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <motion.div
              className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
              }}
            >
              <Input
                placeholder="What service are you looking for?"
                icon={<Search className="w-5 h-5" />}
                className="flex-1 bg-transparent border-none text-white placeholder-white/70 focus:ring-0"
              />
              <NeonButton variant="accent" size="lg" glowColor="#FFC107">
                Search Services
              </NeonButton>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <NeonButton variant="primary" size="lg" glowColor="#9945FF">
              Start as Artisan
            </NeonButton>
            <NeonButton variant="secondary" size="lg" glowColor="#2E1A47">
              Hire Talent
            </NeonButton>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="text-center space-y-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(255, 193, 7, 0.5)",
                  rotate: 5,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">
                Secure Escrow
              </h3>
              <p className="text-white/70">
                Smart contracts protect both parties with automatic payment
                release
              </p>
            </div>

            <div className="text-center space-y-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(153, 69, 255, 0.5)",
                  rotate: -5,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">
                NFT Reputation
              </h3>
              <p className="text-white/70">
                Earn unique badges for quality work that build your on-chain
                reputation
              </p>
            </div>

            <div className="text-center space-y-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(79, 70, 229, 0.5)",
                  rotate: 5,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">
                Instant Payments
              </h3>
              <p className="text-white/70">
                Lightning-fast transactions with minimal fees on Solana
                blockchain
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20"
          >
            {[
              { number: "1,000+", label: "Active Artisans" },
              { number: "5,000+", label: "Jobs Completed" },
              { number: "$2M+", label: "Paid to Artisans" },
              { number: "50+", label: "Countries" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

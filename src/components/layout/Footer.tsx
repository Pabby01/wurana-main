import React from "react";
import { motion } from "framer-motion";

import { Twitter, Github, Disc as Discord, ArrowUp, Send } from "lucide-react";
import { NeonButton } from "../ui/NeonButton";
import { Input } from "../ui/Input";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = {
    artisans: [
      { label: "Create Profile", path: "/create-profile" },
      { label: "List Services", path: "/list-service" },
      { label: "Find Jobs", path: "/jobs" },
      { label: "Earn Badges", path: "/badges" },
    ],
    clients: [
      { label: "Browse Services", path: "/marketplace" },
      { label: "Post Jobs", path: "/post-job" },
      { label: "Secure Payments", path: "/payments" },
      { label: "Leave Reviews", path: "/reviews" },
    ],
    support: [
      { label: "Help Center", path: "/help" },
      { label: "Safety", path: "/safety" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Privacy Policy", path: "/privacy" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pb-12 border-b border-white/20"
        >
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Get the latest updates on new artisans, featured services, and
            platform improvements
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="max-w-md mx-auto flex gap-3"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/70"
              required
            />
            <NeonButton
              type="submit"
              variant="accent"
              loading={isSubmitting}
              glowColor="#FFC107"
            >
              <Send className="w-4 h-4" />
            </NeonButton>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/">
              <motion.div
                className="flex items-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="relative w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                  whileHover={{
                    boxShadow: "0 0 20px rgba(255, 193, 7, 0.5)",
                    rotate: 5,
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Wurana Logo"
                    className="w-8 h-8 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
                <span className="text-white font-bold text-xl">Wurana</span>
              </motion.div>
            </Link>
            <p className="text-white/80 text-sm">
              Harnessing the Power of Solana to Empower Artisans
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#", color: "#1DA1F2" },
                { icon: Discord, href: "#", color: "#5865F2" },
                { icon: Github, href: "#", color: "#333" },
              ].map(({ icon: Icon, href, color }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{
                    scale: 1.2,
                    y: -2,
                    boxShadow: `0 0 15px ${color}40`,
                  }}
                  className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* For Artisans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-4">For Artisans</h3>
            <ul className="space-y-2 text-white/80">
              {footerSections.artisans.map((item) => (
                <li key={item.label}>
                  <Link to={item.path}>
                    <motion.span
                      className="block py-1 hover:text-white transition-colors"
                      whileHover={{ x: 4, color: "#FFC107" }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-4">For Clients</h3>
            <ul className="space-y-2 text-white/80">
              {footerSections.clients.map((item) => (
                <li key={item.label}>
                  <Link to={item.path}>
                    <motion.span
                      className="block py-1 hover:text-white transition-colors"
                      whileHover={{ x: 4, color: "#FFC107" }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-white/80">
              {footerSections.support.map((item) => (
                <li key={item.label}>
                  <Link to={item.path}>
                    <motion.span
                      className="block py-1 hover:text-white transition-colors"
                      whileHover={{ x: 4, color: "#FFC107" }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 Wurana. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-white/60 text-sm">Built on</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <span className="text-white font-medium text-sm">Solana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg z-50"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 25px rgba(153, 69, 255, 0.5)",
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

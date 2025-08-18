import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  CreditCard,
  Banknote,
  TrendingUp,
} from "lucide-react";
import { GlassmorphicCard } from "../../components/ui/GlassmorphicCard";
import { NeonButton } from "../../components/ui/NeonButton";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";

interface WalletBalance {
  sol: number;
  usdc: number;
  fiat: number;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "swap";
  amount: number;
  currency: "SOL" | "USDC" | "USD";
  status: "pending" | "completed" | "failed";
  timestamp: Date;
  hash?: string;
}

export const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "deposit" | "withdraw" | "swap"
  >("overview");
  const [showBalances, setShowBalances] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [balance, setBalance] = useState<WalletBalance>({
    sol: 12.45,
    usdc: 150.75,
    fiat: 2456.8,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      amount: 100,
      currency: "USDC",
      status: "completed",
      timestamp: new Date(Date.now() - 86400000),
      hash: "5KJp9vn...",
    },
    {
      id: "2",
      type: "withdraw",
      amount: 5.5,
      currency: "SOL",
      status: "pending",
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  // Deposit/Withdraw form states
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState<"sol" | "usdc" | "fiat">(
    "usdc"
  );
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<"sol" | "usdc" | "fiat">(
    "usdc"
  );
  const [withdrawAddress, setWithdrawAddress] = useState("");

  // Swap form states
  const [swapFrom, setSwapFrom] = useState<"sol" | "usdc">("sol");
  const [swapTo, setSwapTo] = useState<"sol" | "usdc">("usdc");
  const [swapAmount, setSwapAmount] = useState("");
  const [estimatedOutput, setEstimatedOutput] = useState("0.00");

  const copyWalletAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      // Show toast notification
    }
  };

  const handleDeposit = async () => {
    setIsLoading(true);
    try {
      // Implement deposit logic based on method
      console.log("Depositing:", depositAmount, depositMethod);
      // Add transaction to list
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "deposit",
        amount: parseFloat(depositAmount),
        currency: depositMethod.toUpperCase() as "SOL" | "USDC" | "USD",
        status: "pending",
        timestamp: new Date(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setDepositAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      // Implement withdraw logic
      console.log(
        "Withdrawing:",
        withdrawAmount,
        withdrawMethod,
        "to",
        withdrawAddress
      );
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "withdraw",
        amount: parseFloat(withdrawAmount),
        currency: withdrawMethod.toUpperCase() as "SOL" | "USDC" | "USD",
        status: "pending",
        timestamp: new Date(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setWithdrawAmount("");
      setWithdrawAddress("");
    } catch (error) {
      console.error("Withdraw failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      // Implement swap logic using Jupiter API or similar
      console.log("Swapping:", swapAmount, swapFrom, "to", swapTo);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "swap",
        amount: parseFloat(swapAmount),
        currency: swapFrom.toUpperCase() as "SOL" | "USDC",
        status: "pending",
        timestamp: new Date(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setSwapAmount("");
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate estimated swap output
  useEffect(() => {
    if (swapAmount && parseFloat(swapAmount) > 0) {
      // Mock exchange rate calculation
      const mockRates = { sol_to_usdc: 145.5, usdc_to_sol: 0.00687 };
      const rate =
        swapFrom === "sol" ? mockRates.sol_to_usdc : mockRates.usdc_to_sol;
      setEstimatedOutput((parseFloat(swapAmount) * rate).toFixed(6));
    } else {
      setEstimatedOutput("0.00");
    }
  }, [swapAmount, swapFrom, swapTo]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Wallet },
    { id: "deposit", label: "Deposit", icon: ArrowDownLeft },
    { id: "withdraw", label: "Withdraw", icon: ArrowUpRight },
    { id: "swap", label: "Swap", icon: RefreshCw },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Wallet Management
          </h1>
          <p className="text-gray-600">Manage your crypto and fiat finances</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <GlassmorphicCard className="p-1" opacity={0.2}>
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </GlassmorphicCard>
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Wallet Address */}
              <GlassmorphicCard className="mb-6 p-6" opacity={0.2}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Wallet Address
                  </h3>
                  <button
                    onClick={copyWalletAddress}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm break-all">
                  {user?.walletAddress || "Connect wallet to view address"}
                </div>
              </GlassmorphicCard>

              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassmorphicCard className="p-6" opacity={0.2}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">SOL</span>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Solana</p>
                        <p className="font-semibold text-gray-900">SOL</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBalances(!showBalances)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showBalances ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {showBalances ? balance.sol.toFixed(4) : "••••••"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ≈ $
                    {showBalances ? (balance.sol * 145.5).toFixed(2) : "••••"}
                  </div>
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6" opacity={0.2}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          USDC
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">USD Coin</p>
                        <p className="font-semibold text-gray-900">USDC</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {showBalances ? balance.usdc.toFixed(2) : "••••••"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ≈ ${showBalances ? balance.usdc.toFixed(2) : "••••"}
                  </div>
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6" opacity={0.2}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Fiat Balance</p>
                        <p className="font-semibold text-gray-900">USD</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${showBalances ? balance.fiat.toFixed(2) : "••••••"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Available for withdrawal
                  </div>
                </GlassmorphicCard>
              </div>

              {/* Recent Transactions */}
              <GlassmorphicCard className="p-6" opacity={0.2}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === "deposit"
                              ? "bg-green-100 text-green-600"
                              : tx.type === "withdraw"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {tx.type === "deposit" ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : tx.type === "withdraw" ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {tx.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tx.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {tx.amount} {tx.currency}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === "deposit" && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="p-6 max-w-md mx-auto" opacity={0.2}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Deposit Funds
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "sol", label: "SOL", icon: "🔸" },
                        { value: "usdc", label: "USDC", icon: "🔵" },
                        { value: "fiat", label: "Fiat", icon: "💳" },
                      ].map((method) => (
                        <button
                          key={method.value}
                          onClick={() => setDepositMethod(method.value as any)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            depositMethod === method.value
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-lg mb-1">{method.icon}</div>
                          <div className="text-sm font-medium">
                            {method.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Amount"
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />

                  <NeonButton
                    onClick={handleDeposit}
                    disabled={!depositAmount || isLoading}
                    className="w-full"
                  >
                    {isLoading
                      ? "Processing..."
                      : `Deposit ${depositMethod.toUpperCase()}`}
                  </NeonButton>

                  {depositMethod === "fiat" && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Fiat deposits are processed via
                        Paj Cash integration. Processing time: 1-3 business
                        days.
                      </p>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === "withdraw" && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="p-6 max-w-md mx-auto" opacity={0.2}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Withdraw Funds
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Withdrawal Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "sol", label: "SOL", icon: "🔸" },
                        { value: "usdc", label: "USDC", icon: "🔵" },
                        { value: "fiat", label: "Fiat", icon: "💳" },
                      ].map((method) => (
                        <button
                          key={method.value}
                          onClick={() => setWithdrawMethod(method.value as any)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            withdrawMethod === method.value
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-lg mb-1">{method.icon}</div>
                          <div className="text-sm font-medium">
                            {method.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Amount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />

                  {withdrawMethod !== "fiat" && (
                    <Input
                      label="Recipient Address"
                      placeholder="Enter wallet address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                    />
                  )}

                  <NeonButton
                    onClick={handleWithdraw}
                    disabled={
                      !withdrawAmount ||
                      (!withdrawAddress && withdrawMethod !== "fiat") ||
                      isLoading
                    }
                    className="w-full"
                  >
                    {isLoading
                      ? "Processing..."
                      : `Withdraw ${withdrawMethod.toUpperCase()}`}
                  </NeonButton>

                  {withdrawMethod === "fiat" && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Fiat withdrawals are processed to
                        your linked bank account via Paj Cash. Processing time:
                        1-5 business days.
                      </p>
                    </div>
                  )}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === "swap" && (
            <motion.div
              key="swap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphicCard className="p-6 max-w-md mx-auto" opacity={0.2}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Swap Tokens
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={swapFrom}
                        onChange={(e) => {
                          setSwapFrom(e.target.value as any);
                          setSwapTo(e.target.value === "sol" ? "usdc" : "sol");
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="sol">SOL</option>
                        <option value="usdc">USDC</option>
                      </select>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        const temp = swapFrom;
                        setSwapFrom(swapTo);
                        setSwapTo(temp);
                      }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-gray-600 transform rotate-90" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To (Estimated)
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={swapTo}
                        disabled
                        className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50"
                      >
                        <option value="sol">SOL</option>
                        <option value="usdc">USDC</option>
                      </select>
                      <div className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                        {estimatedOutput}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>Exchange Rate:</strong> 1 {swapFrom.toUpperCase()}{" "}
                      ≈ {swapFrom === "sol" ? "145.50" : "0.00687"}{" "}
                      {swapTo.toUpperCase()}
                    </p>
                  </div>

                  <NeonButton
                    onClick={handleSwap}
                    disabled={!swapAmount || isLoading}
                    className="w-full"
                  >
                    {isLoading
                      ? "Swapping..."
                      : `Swap ${swapFrom.toUpperCase()} to ${swapTo.toUpperCase()}`}
                  </NeonButton>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

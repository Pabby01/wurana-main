import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Shield,
  Bell,
  Eye,
  CreditCard,
  Globe,
  Wallet,
  Trash2,
  Check,
  X,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Languages,
  MapPin,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowContact: boolean;
}

interface UserSettings {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  language: string;
  timezone: string;
  defaultCurrency: string;
}

const mockPaymentMethods = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
];

const mockWallets = [
  {
    id: "1",
    name: "Phantom",
    address: "7xKXtg2CW87d9wdcxdwxK",
    connected: true,
    balance: "12.45 SOL",
  },
  {
    id: "2",
    name: "Solflare",
    address: "5yHfEyrjRjhr6T9S",
    connected: false,
    balance: "0 SOL",
  },
];

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    email: "user@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowContact: true,
    },
    language: "en",
    timezone: "UTC-5",
    defaultCurrency: "USD",
  });

  const sections: SettingsSection[] = [
    {
      id: "account",
      title: "Account Settings",
      icon: <User className="w-5 h-5" />,
      description: "Manage your account details and security",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      description: "Control how you receive notifications",
    },
    {
      id: "privacy",
      title: "Privacy",
      icon: <Eye className="w-5 h-5" />,
      description: "Manage your privacy and visibility settings",
    },
    {
      id: "payments",
      title: "Payment Methods",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Manage your payment methods and billing",
    },
    {
      id: "preferences",
      title: "Preferences",
      icon: <Globe className="w-5 h-5" />,
      description: "Language, timezone, and regional settings",
    },
    {
      id: "wallets",
      title: "Wallet Management",
      icon: <Wallet className="w-5 h-5" />,
      description: "Connect and manage your crypto wallets",
    },
    {
      id: "danger",
      title: "Danger Zone",
      icon: <Trash2 className="w-5 h-5" />,
      description: "Account deletion and irreversible actions",
    },
  ];

  const updateSettings = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedSettings = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    // Show success message
  };

  const handlePasswordChange = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setShowPasswordDialog(false);
    updateSettings("currentPassword", "");
    updateSettings("newPassword", "");
    updateSettings("confirmPassword", "");
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // This would redirect to login/home after account deletion
    console.log("Account deleted");
    setLoading(false);
    setShowDeleteDialog(false);
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(e) => updateSettings("email", e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security
                </p>
              </div>
            </div>
            <Button
              variant={settings.twoFactorEnabled ? "secondary" : "primary"}
              size="sm"
              onClick={() =>
                updateSettings("twoFactorEnabled", !settings.twoFactorEnabled)
              }
            >
              {settings.twoFactorEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
        <Button
          variant="outline"
          onClick={() => setShowPasswordDialog(true)}
          className="flex items-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span>Change Password</span>
        </Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Notification Preferences
      </h3>
      <div className="space-y-4">
        {[
          {
            key: "email",
            icon: <Mail className="w-4 h-4" />,
            label: "Email Notifications",
            desc: "Receive notifications via email",
          },
          {
            key: "push",
            icon: <Bell className="w-4 h-4" />,
            label: "Push Notifications",
            desc: "Browser push notifications",
          },
          {
            key: "sms",
            icon: <Phone className="w-4 h-4" />,
            label: "SMS Notifications",
            desc: "Text message notifications",
          },
          {
            key: "marketing",
            icon: <MessageSquare className="w-4 h-4" />,
            label: "Marketing Communications",
            desc: "Product updates and promotions",
          },
        ].map(({ key, icon, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-600">{icon}</div>
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
            <button
              onClick={() =>
                updateNestedSettings(
                  "notifications",
                  key,
                  !(settings.notifications as any)[key]
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                (settings.notifications as any)[key]
                  ? "bg-purple-600"
                  : "bg-gray-200"
              }`}
              aria-label={`Toggle ${label}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  (settings.notifications as any)[key]
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Privacy Controls</h3>
      <div className="space-y-4">
        {[
          {
            key: "profileVisible",
            label: "Profile Visibility",
            desc: "Make your profile visible to other users",
          },
          {
            key: "showEmail",
            label: "Show Email Address",
            desc: "Display your email on your public profile",
          },
          {
            key: "showPhone",
            label: "Show Phone Number",
            desc: "Display your phone number on your profile",
          },
          {
            key: "allowContact",
            label: "Allow Direct Contact",
            desc: "Allow other users to contact you directly",
          },
        ].map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">{label}</p>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
            <button
              onClick={() =>
                updateNestedSettings(
                  "privacy",
                  key,
                  !(settings.privacy as any)[key]
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                (settings.privacy as any)[key] ? "bg-purple-600" : "bg-gray-200"
              }`}
              aria-label={`Toggle ${label}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  (settings.privacy as any)[key]
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
        <Button variant="primary" size="sm">
          Add New Method
        </Button>
      </div>
      <div className="space-y-3">
        {mockPaymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {method.type} •••• {method.last4}
                </p>
                <p className="text-sm text-gray-600">
                  Expires {method.expiryMonth}/{method.expiryYear}
                  {method.isDefault && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!method.isDefault && (
                <Button variant="ghost" size="sm">
                  Set Default
                </Button>
              )}
              <Button variant="ghost" size="sm" title="Remove payment method">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Regional Preferences
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => updateSettings("language", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => updateSettings("timezone", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="UTC-12">UTC-12 (Baker Island)</option>
            <option value="UTC-8">UTC-8 (Pacific Time)</option>
            <option value="UTC-5">UTC-5 (Eastern Time)</option>
            <option value="UTC+0">UTC+0 (London)</option>
            <option value="UTC+1">UTC+1 (Berlin)</option>
            <option value="UTC+9">UTC+9 (Tokyo)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Currency
          </label>
          <select
            value={settings.defaultCurrency}
            onChange={(e) => updateSettings("defaultCurrency", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="SOL">SOL - Solana</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderWalletManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Connected Wallets
        </h3>
        <Button variant="primary" size="sm">
          Connect Wallet
        </Button>
      </div>
      <div className="space-y-3">
        {mockWallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{wallet.name}</p>
                <p className="text-sm text-gray-600">
                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-4)}
                </p>
                <p className="text-sm text-gray-600">
                  Balance: {wallet.balance}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  wallet.connected
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {wallet.connected ? "Connected" : "Disconnected"}
              </span>
              <Button
                variant={wallet.connected ? "ghost" : "primary"}
                size="sm"
              >
                {wallet.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-red-700 mb-4">
              These actions are permanent and cannot be undone. Please proceed
              with caution.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return renderAccountSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      case "payments":
        return renderPaymentMethods();
      case "preferences":
        return renderPreferences();
      case "wallets":
        return renderWalletManagement();
      case "danger":
        return renderDangerZone();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="p-6">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {section.icon}
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          activeSection === section.id ? "rotate-90" : ""
                        }`}
                      />
                    </motion.button>
                  ))}
                </nav>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-6">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <Button variant="ghost">Cancel</Button>
                    <Button
                      variant="primary"
                      loading={loading}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      {showPasswordDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowPasswordDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={settings.currentPassword}
                onChange={(e) =>
                  updateSettings("currentPassword", e.target.value)
                }
              />
              <Input
                label="New Password"
                type="password"
                value={settings.newPassword}
                onChange={(e) => updateSettings("newPassword", e.target.value)}
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={settings.confirmPassword}
                onChange={(e) =>
                  updateSettings("confirmPassword", e.target.value)
                }
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowPasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={loading}
                onClick={handlePasswordChange}
              >
                Update Password
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDeleteDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your account? This will
              permanently remove all your data, including your profile,
              transactions, and connected wallets.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={loading}
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

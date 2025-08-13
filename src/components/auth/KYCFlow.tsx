/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Shield, CheckCircle, User, Mail, Phone, MapPin } from 'lucide-react';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { SecurityIndicator } from '../ui/SecurityIndicator';
import { NeonButton } from '../ui/NeonButton';
import { Input } from '../ui/Input';
import { GlassmorphicCard } from '../ui/GlassmorphicCard';

const kycSteps = [
  { id: 'personal', title: 'Personal Info', description: 'Basic details' },
  { id: 'identity', title: 'Identity', description: 'Document upload' },
  { id: 'biometric', title: 'Biometric', description: 'Face verification' },
  { id: 'review', title: 'Review', description: 'Final check' }
];

interface KYCFlowProps {
  onComplete: () => void;
  className?: string;
}

export const KYCFlow: React.FC<KYCFlowProps> = ({ onComplete, className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    documentType: 'passport',
    documentFile: null as File | null,
    biometricComplete: false
  });
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [securityScore, setSecurityScore] = useState(25);
  // const { requestGatewayToken, gatewayStatus } = useGateway();

  const updateSecurityLevel = () => {
    let score = 0;
    if (formData.firstName && formData.lastName) score += 20;
    if (formData.email) score += 15;
    if (formData.phone) score += 15;
    if (formData.address) score += 10;
    if (formData.documentFile) score += 25;
    if (formData.biometricComplete) score += 15;

    setSecurityScore(score);
    
    if (score < 40) setSecurityLevel('low');
    else if (score < 80) setSecurityLevel('medium');
    else setSecurityLevel('high');
  };

  React.useEffect(() => {
    updateSecurityLevel();
  }, [formData]);

  const handleNext = () => {
    if (currentStep < kycSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleFileUpload = (file: File) => {
    setFormData({ ...formData, documentFile: file });
  };

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Please provide your basic details to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          icon={<User className="w-4 h-4" />}
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          icon={<User className="w-4 h-4" />}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        icon={<Mail className="w-4 h-4" />}
      />

      <Input
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        icon={<Phone className="w-4 h-4" />}
      />

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        icon={<MapPin className="w-4 h-4" />}
      />
    </motion.div>
  );

  const renderIdentityVerification = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h3>
        <p className="text-gray-600">Upload a government-issued ID for verification</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <select
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID</option>
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop your document here, or click to browse
          </p>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="document-upload"
          />
          <label htmlFor="document-upload">
            <NeonButton variant="primary" size="sm">
              Choose File
            </NeonButton>
          </label>
          {formData.documentFile && (
            <p className="text-green-600 mt-2 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {formData.documentFile.name}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderBiometricVerification = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Camera className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Biometric Verification</h3>
        <p className="text-gray-600">Take a selfie to verify your identity</p>
      </div>

      <GlassmorphicCard className="p-8 text-center">
        <div className="w-48 h-48 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Camera className="w-16 h-16 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Position your face in the center and click capture when ready
          </p>
          
          <NeonButton
            variant="primary"
            onClick={() => setFormData({ ...formData, biometricComplete: true })}
            className="mx-auto"
          >
            {formData.biometricComplete ? 'Retake Photo' : 'Capture Photo'}
          </NeonButton>
          
          {formData.biometricComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center text-green-600"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Biometric verification complete
            </motion.div>
          )}
        </div>
      </GlassmorphicCard>
    </motion.div>
  );

  const renderReview = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h3>
        <p className="text-gray-600">Please review your information before submitting</p>
      </div>

      <GlassmorphicCard className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Document:</span>
            <span className="font-medium capitalize">{formData.documentType.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Biometric:</span>
            <span className="font-medium text-green-600">
              {formData.biometricComplete ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderIdentityVerification();
      case 2: return renderBiometricVerification();
      case 3: return renderReview();
      default: return null;
    }
  };

  return (
    <div className={className}>
      <GlassmorphicCard className="max-w-4xl mx-auto p-8">
        <ProgressIndicator
          steps={kycSteps}
          currentStep={currentStep}
          className="mb-8"
        />

        <SecurityIndicator
          level={securityLevel}
          score={securityScore}
          className="mb-8"
        />

        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <NeonButton
            variant="secondary"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </NeonButton>
          
          <NeonButton
            variant="primary"
            onClick={handleNext}
          >
            {currentStep === kycSteps.length - 1 ? 'Submit' : 'Next'}
          </NeonButton>
        </div>
      </GlassmorphicCard>
    </div>
  );
};
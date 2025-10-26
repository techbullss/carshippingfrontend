// components/VerificationSuccess.tsx
import React from 'react';
import { CheckCircle, Mail, Clock, Users, Shield } from 'lucide-react';

const VerificationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Welcome to the F-CarShipping Family! 🎉
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Thank you for verifying your email and taking the first step towards seamless vehicle shipping with us.
        </p>

        {/* Progress Steps */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            What Happens Next?
          </h2>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Application Review</h3>
                <p className="text-gray-600 text-sm">Our team is currently reviewing your application</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Document Verification</h3>
                <p className="text-gray-600 text-sm">We'll verify your submitted documents within 24-48 hours</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Welcome Package</h3>
                <p className="text-gray-600 text-sm">You'll receive a welcome email with next steps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">500+</p>
            <p className="text-sm text-gray-600">Vehicles Shipped</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">100%</p>
            <p className="text-sm text-gray-600">Secure Delivery</p>
          </div>
          <div className="text-center">
            <Mail className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">24/7</p>
            <p className="text-sm text-gray-600">Support</p>
          </div>
        </div>

        {/* Final Message */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
          <p className="opacity-90">
            While we review your application, feel free to explore our services or contact our support team with any questions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-200"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/services'}
            className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 py-3 px-6 rounded-lg font-semibold transition duration-200"
          >
            Explore Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;
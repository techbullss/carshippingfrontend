'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCountryCallingCode } from "libphonenumber-js";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address Information
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Account Information
  password: string;
  confirmPassword: string;
  
  // Shipping Preferences
  preferredCommunication: string[];
  newsletter: boolean;
  termsAccepted: boolean;
  
  // Vehicle Shipping Specific
  shippingFrequency: string;
  vehicleType: string;
  estimatedShippingDate: string;
 
  status: string;
  idNumber: string;
  
  // Document Uploads
  govtId?: File;
  passportPhoto?: File;
  
  // Seller Type
  sellerType: 'individual' | 'company';
  
  // Company Fields (for company sellers)
  companyName?: string;
  companyRegistrationNumber?: string;
  kraPin?: string;
  businessPermitNumber?: string;
  companyAddress?: string;
  
  // Company Document Uploads
  certificateOfIncorporation?: File;
  kraPinCertificate?: File;
  businessPermit?: File;
  trademarkImage?: File;
}

// Types for API
interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  password: string;
  preferredCommunication: string[];
  newsletter: boolean;
  shippingFrequency: string;
  vehicleType: string;
  estimatedShippingDate: string;
  idNumber: string;
  status: string;
  sellerType: 'individual' | 'company';
  companyName?: string;
  companyRegistrationNumber?: string;
  kraPin?: string;
  businessPermitNumber?: string;
  companyAddress?: string;
}

interface AuthResponse {
  message: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.f-carshipping.com/api';

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    password: '',
    confirmPassword: '',
    preferredCommunication: [],
    newsletter: false,
    termsAccepted: false,
    shippingFrequency: '',
    vehicleType: '',
    estimatedShippingDate: '',
    status: '',
    idNumber: '',
    sellerType: 'individual', // Default to individual
    
    // Company fields
    companyName: '',
    companyRegistrationNumber: '',
    kraPin: '',
    businessPermitNumber: '',
    companyAddress: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+");
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoadingLocation(true);
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data && data.country_name && data.country_code) {
          const country = data.country_name;
          const countryCode = data.country_code;
          const phoneCode = getCountryCallingCode(countryCode);

          setFormData((prev) => ({
            ...prev,
            country: country,
            phone: `+${phoneCode} `,
          }));
        }
      } catch (err) {
        console.error("Location fetch failed:", err);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchLocation();
  }, [setFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'sellerType') {
      // Reset company fields when switching to individual
      if (value === 'individual') {
        setFormData(prev => ({
          ...prev,
          sellerType: value as 'individual' | 'company',
          companyName: '',
          companyRegistrationNumber: '',
          kraPin: '',
          businessPermitNumber: '',
          companyAddress: '',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          sellerType: value as 'individual' | 'company',
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      preferredCommunication: checked
        ? [...prev.preferredCommunication, value]
        : prev.preferredCommunication.filter(item => item !== value)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.sellerType);
      case 2:
        if (formData.sellerType === 'individual') {
          // For individual, only validate basic info in step 2 (no idNumber here)
          return true; // Step 2 for individual just shows a message, no required fields
        } else {
          // Company validation for step 2
          return !!(
            formData.companyName &&
            formData.companyRegistrationNumber &&
            formData.kraPin &&
            formData.businessPermitNumber &&
            formData.companyAddress
          );
        }
      case 3:
        // Address and Documents validation
        const addressValid = !!(formData.streetAddress && formData.city && formData.state && formData.postalCode && formData.country);
        
        if (formData.sellerType === 'individual') {
          // Individual requires idNumber and files
          return !!(addressValid && formData.idNumber && formData.govtId && formData.passportPhoto);
        } else {
          // Company requires all documents
          return !!(addressValid && 
            formData.certificateOfIncorporation && 
            formData.kraPinCertificate && 
            formData.businessPermit && 
            formData.trademarkImage);
        }
      case 4:
        return !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 8);
      case 5:
        return !!(formData.termsAccepted);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill in all required fields correctly.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  // API call handled directly in component
  const handleSignup = async (): Promise<AuthResponse> => {
    const multipartData = new FormData();

    // Prepare JSON data (excluding files and confirmPassword)
    const { govtId, passportPhoto, confirmPassword, termsAccepted, 
            certificateOfIncorporation, kraPinCertificate, businessPermit, trademarkImage,
            ...userData } = formData;

    // Append "data" JSON as Blob
    multipartData.append("data", new Blob([JSON.stringify(userData)], { type: "application/json" }));

    // Append files if provided (individual)
    if (govtId) multipartData.append("govtId", govtId);
    if (passportPhoto) multipartData.append("passportPhoto", passportPhoto);
    
    // Append company files if provided and seller is company
    if (formData.sellerType === 'company') {
      if (certificateOfIncorporation) multipartData.append("certificateOfIncorporation", certificateOfIncorporation);
      if (kraPinCertificate) multipartData.append("kraPinCertificate", kraPinCertificate);
      if (businessPermit) multipartData.append("businessPermit", businessPermit);
      if (trademarkImage) multipartData.append("trademarkImage", trademarkImage);
    }

    // Send multipart request to backend
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      body: multipartData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Registration failed');
    }

    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateStep(5)) {
      setError('Please accept the terms and conditions.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📤 Sending registration to backend...', formData);

      const response = await handleSignup();

      // Redirect to verification page
      router.push(`/VerifyEmail?email=${formData.email}`);

    } catch (err: any) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account Type' },
    { number: 2, title: formData.sellerType === 'individual' ? 'Personal Info' : 'Company Info' },
    { number: 3, title: 'Address & Documents' },
    { number: 4, title: 'Account Security' },
    { number: 5, title: 'Preferences' },
  ];

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl">
          <div className="mx-auto w-full max-w-2xl">
            <div>
              <h2 className="mt-8 text-3xl font-extrabold text-gray-900">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/Login" className="font-medium text-blue-700 hover:text-blue-600">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step.number
                          ? 'bg-blue-700 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.number}
                      </div>
                      <span className={`ml-2 text-sm font-medium hidden sm:block ${
                        currentStep >= step.number ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 ${
                        currentStep > step.number ? 'bg-blue-700' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mt-8">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Account Type Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Select Account Type *
                      </label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div
                          className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                            formData.sellerType === 'individual'
                              ? 'border-blue-700 bg-blue-50 ring-2 ring-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, sellerType: 'individual' }))}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="sellerType"
                              value="individual"
                              checked={formData.sellerType === 'individual'}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300"
                            />
                            <label className="ml-3 block text-sm font-medium text-gray-700">
                              Individual Seller
                            </label>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 ml-7">
                            Sell as an individual person. Requires personal ID and passport photo.
                          </p>
                        </div>

                        <div
                          className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                            formData.sellerType === 'company'
                              ? 'border-blue-700 bg-blue-50 ring-2 ring-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, sellerType: 'company' }))}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="sellerType"
                              value="company"
                              checked={formData.sellerType === 'company'}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300"
                            />
                            <label className="ml-3 block text-sm font-medium text-gray-700">
                              Company Seller
                            </label>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 ml-7">
                            Register as a Kenyan company. Requires company registration documents.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Contact Person First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Contact Person Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      {loadingLocation && <p className="text-xs text-gray-500 mt-1">Detecting location...</p>}
                    </div>
                  </div>
                )}

                {/* Step 2: Personal or Company Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {formData.sellerType === 'individual' ? (
                      // Individual - No fields needed, just a message
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-blue-900">Individual Seller Information</h3>
                        <p className="mt-1 text-sm text-blue-700">
                          You're registering as an individual seller. In the next step, you'll provide your address and upload your identification documents.
                        </p>
                      </div>
                    ) : (
                      // Company Fields
                      <>
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                            Company Name (as registered) *
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            required
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700">
                              Company Registration Number *
                            </label>
                            <input
                              type="text"
                              id="companyRegistrationNumber"
                              name="companyRegistrationNumber"
                              required
                              placeholder="e.g., CPR/2023/123456"
                              value={formData.companyRegistrationNumber}
                              onChange={handleInputChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="kraPin" className="block text-sm font-medium text-gray-700">
                              KRA PIN *
                            </label>
                            <input
                              type="text"
                              id="kraPin"
                              name="kraPin"
                              required
                              placeholder="e.g., A123456789P"
                              value={formData.kraPin}
                              onChange={handleInputChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="businessPermitNumber" className="block text-sm font-medium text-gray-700">
                              Business Permit Number *
                            </label>
                            <input
                              type="text"
                              id="businessPermitNumber"
                              name="businessPermitNumber"
                              required
                              placeholder="e.g., BPL/2024/7890"
                              value={formData.businessPermitNumber}
                              onChange={handleInputChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
                              Company Registered Address *
                            </label>
                            <input
                              type="text"
                              id="companyAddress"
                              name="companyAddress"
                              required
                              placeholder="Physical address of company"
                              value={formData.companyAddress}
                              onChange={handleInputChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Address Information & Documents */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Address Fields */}
                    <div>
                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        required
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          County/Province *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country *
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Document Uploads based on seller type */}
                    {formData.sellerType === 'individual' ? (
                      // Individual Documents
                      <>
                        <div>
                          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                            ID/Passport Number *
                          </label>
                          <input
                            type="text"
                            id="idNumber"
                            name="idNumber"
                            required
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="govtId" className="block text-sm font-medium text-gray-700">
                              Upload Government Issued ID / Passport *
                            </label>
                            <input
                              type="file"
                              id="govtId"
                              name="govtId"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(e, "govtId")}
                              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="passportPhoto" className="block text-sm font-medium text-gray-700">
                              Upload Passport Size Photo *
                            </label>
                            <input
                              type="file"
                              id="passportPhoto"
                              name="passportPhoto"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "passportPhoto")}
                              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      // Company Documents (Kenya-specific)
                      <>
                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Required Company Documents (Kenya)</h3>
                          <p className="text-sm text-gray-500 mb-4">All documents must be clear and in PDF or image format</p>
                          
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                              <label htmlFor="certificateOfIncorporation" className="block text-sm font-medium text-gray-700">
                                Certificate of Incorporation *
                              </label>
                              <input
                                type="file"
                                id="certificateOfIncorporation"
                                name="certificateOfIncorporation"
                                accept="image/*,application/pdf"
                                required
                                onChange={(e) => handleFileChange(e, "certificateOfIncorporation")}
                                className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label htmlFor="kraPinCertificate" className="block text-sm font-medium text-gray-700">
                                KRA PIN Certificate *
                              </label>
                              <input
                                type="file"
                                id="kraPinCertificate"
                                name="kraPinCertificate"
                                accept="image/*,application/pdf"
                                required
                                onChange={(e) => handleFileChange(e, "kraPinCertificate")}
                                className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
                            <div>
                              <label htmlFor="businessPermit" className="block text-sm font-medium text-gray-700">
                                Current Business Permit *
                              </label>
                              <input
                                type="file"
                                id="businessPermit"
                                name="businessPermit"
                                accept="image/*,application/pdf"
                                required
                                onChange={(e) => handleFileChange(e, "businessPermit")}
                                className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label htmlFor="trademarkImage" className="block text-sm font-medium text-gray-700">
                                Company Logo / Trademark *
                              </label>
                              <input
                                type="file"
                                id="trademarkImage"
                                name="trademarkImage"
                                accept="image/*"
                                required
                                onChange={(e) => handleFileChange(e, "trademarkImage")}
                                className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <p className="mt-1 text-xs text-gray-500">Upload your company logo or trademark image</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 4: Account Information */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* PASSWORD FIELD */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>

                      <div className="mt-1 relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          required
                          minLength={8}
                          pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                          title="Must contain 8+ characters, 1 uppercase, 1 number, and 1 special character."
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                            formData.password && !passwordRegex.test(formData.password)
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />

                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>

                      {/* PASSWORD REQUIREMENTS CHECKLIST */}
                      <div className="mt-2 text-xs space-y-1">
                        <p className={formData.password.length >= 8 ? "text-green-600" : "text-gray-500"}>
                          ✔ At least 8 characters
                        </p>
                        <p className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                          ✔ One uppercase letter
                        </p>
                        <p className={/\d/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                          ✔ One number
                        </p>
                        <p className={/[@$!%*?&]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                          ✔ One special character (@$!%*?&)
                        </p>
                      </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password *
                      </label>

                      <div className="mt-1 relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />

                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                      </div>

                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">❌ Passwords do not match</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Preferences */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        required
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-700 hover:text-blue-600">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-blue-700 hover:text-blue-600">
                          Privacy Policy
                        </Link>{' '}
                        *
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Previous
                      </button>
                    )}
                  </div>
                  
                  <div>
                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </>
                        ) : 'Create Account'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
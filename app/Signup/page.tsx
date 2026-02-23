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
  dateOfBirth: string;
  gender: string;
  
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
}

// Types for API
interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
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
 
  idNumber: '',
  status: '',
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
    dateOfBirth: '',
    gender: '',
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
        const res = await fetch("https://ipapi.co/json/"); // free and reliable API
        const data = await res.json();

        if (data && data.country_name && data.country_code) {
          const country = data.country_name;
          const countryCode = data.country_code; // e.g., "KE", "US", "GB"
          const phoneCode = getCountryCallingCode(countryCode); // e.g., "254"

          setFormData((prev) => ({
            ...prev,
            country: country,
            phone: `+${phoneCode} `, // prefill with +254 format
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
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth);
      case 2:
        return !!(formData.streetAddress && formData.city && formData.state && formData.postalCode && formData.country);
      case 3:
        return !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 8);
      case 4:
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

  // Prepare JSON data (excluding files)
  const { govtId, passportPhoto, confirmPassword, termsAccepted, ...userData } = formData;

  // Append "data" JSON as Blob
  
    multipartData.append("data", new Blob([JSON.stringify(userData)], { type: "application/json" }));


  // Append files if provided
  if (govtId) multipartData.append("govtId", govtId);
  if (passportPhoto) multipartData.append("passportPhoto", passportPhoto);

  // Send multipart request to backend
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    body: multipartData, // 👈 DO NOT manually set headers — browser handles it
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

  if (!validateStep(4)) {
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
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Address' },
    { number: 3, title: 'Account' },
    { number: 4, title: 'Preferences' },
  ];

  return (
    <>
      

      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className=" flex flex-col justify-center py-8 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
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
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name *
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
                          Last Name *
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {loadingLocation && <p className="text-xs text-gray-500 mt-1">Detecting location...</p>}
      </div>


                    
                  </div>
                )}

             {/* Step 2: Address Information */}
{currentStep === 2 && (
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
          State/Province *
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

    {/* New Fields */}
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
  </div>
)}

                {/* Step 3: Account Information */}
              {currentStep === 3 && (
  <div className="space-y-6">
    {/* PASSWORD FIELD */}
    <div>
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700"
      >
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
        <p
          className={
            formData.password.length >= 8
              ? "text-green-600"
              : "text-gray-500"
          }
        >
          ✔ At least 8 characters
        </p>
        <p
          className={
            /[A-Z]/.test(formData.password)
              ? "text-green-600"
              : "text-gray-500"
          }
        >
          ✔ One uppercase letter
        </p>
        <p
          className={
            /\d/.test(formData.password)
              ? "text-green-600"
              : "text-gray-500"
          }
        >
          ✔ One number
        </p>
        <p
          className={
            /[@$!%*?&]/.test(formData.password)
              ? "text-green-600"
              : "text-gray-500"
          }
        >
          ✔ One special character (@$!%*?&)
        </p>
      </div>
    </div>

    {/* CONFIRM PASSWORD */}
    <div>
      <label
        htmlFor="confirmPassword"
        className="block text-sm font-medium text-gray-700"
      >
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
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />

        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            ❌ Passwords do not match
          </p>
        )}
    </div>
  </div>
)}

                {/* Step 4: Preferences */}
                {currentStep === 4 && (
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
                    {currentStep < 4 ? (
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
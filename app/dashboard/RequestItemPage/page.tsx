"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, Package, MapPin, DollarSign, 
  MessageSquare, ShoppingBag, ArrowLeft,
  CheckCircle, Image as ImageIcon, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface FormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  itemName: string;
  category: string;
  description: string;
  originCountry: string;
  destination: string;
  budget: string;
  quantity: number;
  urgency: string;
  notes: string;
}

interface ImagePreview {
  file: File;
  preview: string;
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function RequestItemPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    itemName: "",
    category: "",
    description: "",
    originCountry: "",
    destination: "",
    budget: "",
    quantity: 1,
    urgency: "normal",
    notes: "",
  });

  const categories = [
    "Electronics", "Clothing & Fashion", "Home & Kitchen",
    "Automotive Parts", "Books & Media", "Medical Equipment",
    "Sports Equipment", "Industrial Tools", "Other"
  ];

  const urgencyOptions = [
    { value: "urgent", label: "Urgent (1-2 weeks)", price: "+15%" },
    { value: "normal", label: "Normal (3-4 weeks)", price: "Standard" },
    { value: "flexible", label: "Flexible (1-2 months)", price: "-10%" },
  ];

  // Handle image upload with preview
  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files).slice(0, 5 - imagePreviews.length); // Limit to 5 images
    
    newImages.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError("Please upload only image files");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, {
          file,
          preview: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image from preview
  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Validate form before proceeding
  const validateStep = (currentStep: number): boolean => {
    setError(null);
    
    switch (currentStep) {
      case 1:
        if (!formData.itemName.trim()) {
          setError("Item name is required");
          return false;
        }
        if (!formData.category) {
          setError("Please select a category");
          return false;
        }
        if (!formData.description.trim()) {
          setError("Description is required");
          return false;
        }
        break;
      
      case 2:
        if (!formData.originCountry) {
          setError("Origin country is required");
          return false;
        }
        if (!formData.destination.trim()) {
          setError("Destination is required");
          return false;
        }
        break;
      
      case 3:
        if (!formData.clientName.trim()) {
          setError("Your name is required");
          return false;
        }
        if (!formData.clientEmail.trim()) {
          setError("Email is required");
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
          setError("Please enter a valid email address");
          return false;
        }
        break;
    }
    
    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handleBack = () => {
    setStep(prev => prev - 1);
    setError(null);
  };

  // Submit form to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setLoading(true);
    setError(null);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add images
      imagePreviews.forEach((image, index) => {
        formDataToSend.append('images', image.file);
      });

      // Get authentication token (adjust based on your auth setup)
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/request-item`, {
        method: 'POST',
      
        body: formDataToSend,
        credentials: 'include', // If using cookies/sessions
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to submit request: ${response.status}`);
      }

      const data = await response.json();
      console.log('Request submitted successfully:', data);
      
      // Move to success step
      setStep(4);
      
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err instanceof Error ? err.message : "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update form field
  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format budget for display
  const formatBudget = (budget: string) => {
    if (!budget) return "Not specified";
    return `$${parseFloat(budget).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/auxiliary-shipping" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Services
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Request Item to Source & Ship
          </h1>
          <p className="text-gray-600">
            Fill out this form and our team will find the best options for your requested item
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step >= stepNumber 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-200 text-gray-400"
                }`}>
                  {step > stepNumber ? <CheckCircle size={20} /> : stepNumber}
                </div>
                <span className="text-sm font-medium">
                  {stepNumber === 1 && "Item Details"}
                  {stepNumber === 2 && "Shipping Info"}
                  {stepNumber === 3 && "Review & Submit"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-[-20px] -z-10">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-green-600 transition-all duration-300"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                What item do you need?
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., iPhone 15 Pro, Designer Handbag, Car Parts"
                  value={formData.itemName}
                  onChange={(e) => updateFormData('itemName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Please provide as much detail as possible: brand, model, size, color, specifications, links to similar products, etc."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Reference Images (Optional, max 5)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    disabled={imagePreviews.length >= 5}
                  />
                  <label htmlFor="image-upload" className={`cursor-pointer ${imagePreviews.length >= 5 ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col items-center">
                      <ImageIcon className="text-gray-400 mb-3" size={40} />
                      <p className="text-gray-600 font-medium mb-1">
                        Click to upload images
                      </p>
                      <p className="text-gray-400 text-sm">
                        PNG, JPG, GIF up to 5MB each
                      </p>
                    </div>
                  </label>
                </div>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {imagePreviews.length} of 5 images uploaded
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </div>
                ) : (
                  "Continue to Shipping Details"
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Shipping & Budget Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Origin Country *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.originCountry}
                    onChange={(e) => updateFormData('originCountry', e.target.value)}
                  >
                    <option value="">Select country</option>
                    <option value="Germany">Germany</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Italy">Italy</option>
                    <option value="France">France</option>
                    <option value="USA">USA</option>
                    <option value="China">China</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Nairobi, Kenya"
                    value={formData.destination}
                    onChange={(e) => updateFormData('destination', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline mr-2" size={16} />
                    Estimated Budget (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={(e) => updateFormData('budget', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline mr-2" size={16} />
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.quantity}
                    onChange={(e) => updateFormData('quantity', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How urgent is this request? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {urgencyOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        formData.urgency === option.value
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={option.value}
                        checked={formData.urgency === option.value}
                        onChange={(e) => updateFormData('urgency', e.target.value)}
                        className="hidden"
                      />
                      <div className="font-medium mb-1">
                        {option.label.split(" (")[0]}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {option.label.split("(")[1]?.replace(")", "")}
                      </div>
                      <div className={`text-sm font-medium ${
                        option.price.includes("+") ? "text-red-600" :
                        option.price.includes("-") ? "text-green-600" : "text-gray-600"
                      }`}>
                        {option.price}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </div>
                  ) : (
                    "Continue to Review"
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Review & Contact Details
              </h2>
              
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Request Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium">{formData.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{formData.originCountry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{formData.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{formatBudget(formData.budget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgency:</span>
                    <span className="font-medium">
                      {urgencyOptions.find(o => o.value === formData.urgency)?.label.split(" (")[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <h3 className="font-bold text-lg">Contact Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    value={formData.clientName}
                    onChange={(e) => updateFormData('clientName', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      value={formData.clientEmail}
                      onChange={(e) => updateFormData('clientEmail', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+254 712 345 678"
                      value={formData.clientPhone}
                      onChange={(e) => updateFormData('clientPhone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Any special requirements or questions?"
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Request Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Our team will review your request and contact you within 24-48 hours 
                with sourcing options and a shipping quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/my-requests"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  View My Requests
                </Link>
                <Link
                  href="/auxiliary-shipping"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back to Services
                </Link>
              </div>
            </div>
          )}
        </motion.form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <MessageSquare className="text-blue-500 mr-4 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-blue-800 mb-2">What happens next?</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Our team reviews your request within 24 hours</li>
                <li>• We search for the best suppliers and shipping options</li>
                <li>• You receive a detailed quote with options</li>
                <li>• Once approved, we handle everything end-to-end</li>
                <li>• Track your item's progress in your dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
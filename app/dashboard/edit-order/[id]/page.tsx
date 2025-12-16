"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Package, MapPin, DollarSign, 
  Upload, Image as ImageIcon, X, Loader2,
  AlertCircle, CheckCircle, Save, RefreshCw,
  XCircle
} from "lucide-react";
import Link from "next/link";

// Types
interface OrderFormData {
  itemName: string;
  category: string;
  description: string;
  originCountry: string;
  destination: string;
  budget: string;
  quantity: number;
  urgency: string;
  notes: string;
  existingImages: string[];
  newImages: File[];
}

const API_BASE_URL = "https://api.f-carshipping.com/api/auxiliary";

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<OrderFormData>({
    itemName: "",
    category: "",
    description: "",
    originCountry: "",
    destination: "",
    budget: "",
    quantity: 1,
    urgency: "normal",
    notes: "",
    existingImages: [],
    newImages: []
  });

  const [originalData, setOriginalData] = useState<any>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/requests/${orderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Failed to fetch order details');
        
        const order = await response.json();
        setOriginalData(order);
        
        // Check if order can be edited
        if (!['PENDING', 'SOURCING'].includes(order.status)) {
          setError('This order cannot be edited as it has already progressed beyond the editing stage.');
          return;
        }
        
        // Populate form with existing data
        setFormData({
          itemName: order.itemName || "",
          category: order.category || "",
          description: order.description || "",
          originCountry: order.originCountry || "",
          destination: order.destination || "",
          budget: order.budget?.toString() || "",
          quantity: order.quantity || 1,
          urgency: order.urgency || "normal",
          notes: order.notes || "",
          existingImages: order.imageUrls || [],
          newImages: []
        });
        
        setImagePreviews(order.imageUrls || []);
        
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  // Handle image upload
  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files).slice(0, 5 - (formData.existingImages.length + formData.newImages.length));
    
    newImages.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError("Please upload only image files");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, file]
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index: number) => {
    const newIndex = index - formData.existingImages.length;
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== newIndex)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.itemName.trim()) {
      setError("Item name is required");
      return;
    }
    if (!formData.category) {
      setError("Category is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!formData.originCountry) {
      setError("Origin country is required");
      return;
    }
    if (!formData.destination.trim()) {
      setError("Destination is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      
      // Add updated fields
      const updateData = {
        itemName: formData.itemName,
        category: formData.category,
        description: formData.description,
        originCountry: formData.originCountry,
        destination: formData.destination,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        quantity: formData.quantity,
        urgency: formData.urgency,
        notes: formData.notes,
        imageUrls: formData.existingImages // Send only remaining existing images
      };
      
      // Convert object to JSON string
      formDataToSend.append('request', JSON.stringify(updateData));
      
      // Add new images
      formData.newImages.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`${API_BASE_URL}/requests/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update order: ${response.status}`);
      }

      setSuccess(true);
      
      // Show success message and redirect
      setTimeout(() => {
        router.push('/dashboard/my-orders');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err instanceof Error ? err.message : "Failed to update order. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Update form field
  const updateFormData = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !['PENDING', 'SOURCING'].includes(originalData?.status)) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/dashboard/RequestItemPage" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to My Orders
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Cannot Edit Order</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/dashboard/RequestItemPage"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Return to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/my-orders" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to My Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Order</h1>
              <p className="text-gray-600">Update your shipping request details</p>
            </div>
            
            {originalData && (
              <div className="text-sm">
                <span className="text-gray-600">Current Status: </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  originalData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  originalData.status === 'SOURCING' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {originalData.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="mr-2 flex-shrink-0" size={20} />
            <span>Order updated successfully! Redirecting to orders page...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && !success && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Item Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.itemName}
                    onChange={(e) => updateFormData('itemName', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.category}
                      onChange={(e) => updateFormData('category', e.target.value)}
                      disabled={saving}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.quantity}
                      onChange={(e) => updateFormData('quantity', parseInt(e.target.value))}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Provide detailed description of the item..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
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
                    disabled={saving}
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
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* Budget & Urgency */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Budget & Timeline</h2>
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
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.urgency}
                    onChange={(e) => updateFormData('urgency', e.target.value)}
                    disabled={saving}
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Reference Images</h2>
              <p className="text-gray-600 mb-4">You can remove existing images or add new ones (max 5 total)</p>
              
              {/* Current Images */}
              {imagePreviews.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
                  <div className="flex flex-wrap gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => index < formData.existingImages.length 
                            ? removeExistingImage(index)
                            : removeNewImage(index)
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          disabled={saving}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add New Images */}
              {imagePreviews.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    disabled={saving || imagePreviews.length >= 5}
                  />
                  <label htmlFor="image-upload" className={`cursor-pointer ${(saving || imagePreviews.length >= 5) ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col items-center">
                      <ImageIcon className="text-gray-400 mb-3" size={40} />
                      <p className="text-gray-600 font-medium mb-1">
                        Click to add more images
                      </p>
                      <p className="text-gray-400 text-sm">
                        PNG, JPG, GIF up to 5MB each
                      </p>
                    </div>
                  </label>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                {imagePreviews.length} of 5 images selected
              </p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any special instructions or changes?"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                disabled={saving}
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard/my-orders"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-center"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Update Order
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="text-blue-500 mr-4 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-blue-800 mb-2">Important Notes</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• All changes will be reviewed by our admin team</li>
                <li>• You will receive an email confirmation of your changes</li>
                <li>• Major changes may require additional approval</li>
                <li>• Images can only be removed, not replaced (upload new ones if needed)</li>
                <li>• Orders can only be edited while in "Pending" or "Sourcing" status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
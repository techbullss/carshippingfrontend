// app/dashboard/images/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Clock, Check, X } from 'lucide-react';
import router from 'next/router';
import { useCurrentUser } from '@/app/Hookes/useCurrentUser';

// Types
interface ImageData {
  id: string;
  url: string;
  fileName: string;
  originalName: string;
  uploadedAt: string;
  size: number;
  type: string;
}

interface RotationInfo {
  image: ImageData;
  nextRotation: string;
}

export default function ImageDashboard() {
  // States
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [nextRotation, setNextRotation] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { user } = useCurrentUser();
      const email = user?.email || '';
      const role = user?.roles?.[0] || '';
  // Spring Boot backend URL - Update this with your actual backend URL
  const BACKEND_URL = 'https://api.f-carshipping.com/api';
  
  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
    fetchCurrentImage();
  }, []);
  
  // Fetch all images for the dashboard
  const fetchImages = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  
  // Fetch current displayed image (rotates every 48h)
  const fetchCurrentImage = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/images/current`,{
        credentials: 'include',
      });
      if (response.ok) {
        const data: RotationInfo = await response.json();
        setCurrentImage(data.image);
        setNextRotation(formatDate(data.nextRotation));
      }
    } catch (error) {
      console.error('Error fetching current image:', error);
    }
  };
  
  // Upload image to backend
  const uploadImage = async (file: File) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${BACKEND_URL}/images`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      
      if (response.ok) {
        const newImage = await response.json();
        setImages(prev => [...prev, newImage]);
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };
  
  // Delete image
  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setDeletingId(id);
    
    try {
      const response = await fetch(`${BACKEND_URL}/images/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        // If we deleted the current image, fetch a new one
        if (currentImage?.id === id) {
          fetchCurrentImage();
        }
        alert('Image deleted successfully!');
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    } finally {
      setDeletingId(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    } else {
      alert('Please drop an image file');
    }
  };
  
  // Force rotation (for testing)
  const forceRotate = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/images/rotate`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        fetchCurrentImage();
        alert('Image rotated!');
      }
    } catch (error) {
      console.error('Error rotating image:', error);
    }
  };
  // Improved authentication check for dashboard access
if (!user) {
  // User is not logged in - redirect to login page
  router.push('/Login?redirect=/dashboard');
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

// Check if user has the correct role (ADMIN or SELLER)
if (role !== "ADMIN" && role !== "SELLER") {
  // User is logged in but doesn't have permission
  if (role === "GUEST") {
    // Redirect guests to request items page
    router.push('/dashboard/requestItemPage');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to request items page...</p>
        </div>
      </div>
    );
  } else {
    // Other unauthorized roles
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the dashboard. 
            This area is only available for sellers and administrators.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }
}
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Image Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage images that rotate automatically every 48 hours on your homepage
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Current Display & Upload */}
          <div className="space-y-8">
            {/* Current Display Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Current Display</h2>
                <button
                  onClick={forceRotate}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Force Rotate (Test)
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-100 min-h-[300px] flex items-center justify-center">
                {currentImage ? (
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={currentImage.url}
                      alt="Current display"
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-medium">{currentImage.originalName}</p>
                      <p className="text-white/80 text-sm">
                        Uploaded: {formatDate(currentImage.uploadedAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="text-gray-400 mb-2">
                      <Clock size={48} className="mx-auto" />
                    </div>
                    <p className="text-gray-500">No images available</p>
                    <p className="text-gray-400 text-sm mt-1">Upload images to get started</p>
                  </div>
                )}
              </div>
              
              {nextRotation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Clock className="text-blue-500 mr-2" size={20} />
                    <span className="text-blue-700 font-medium">
                      Next rotation: {nextRotation}
                    </span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    Images automatically change every 48 hours
                  </p>
                </div>
              )}
            </div>
            
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Image</h2>
              
              <div
                className={`border-2 ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} 
                          rounded-xl p-8 text-center transition-all duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="text-blue-600" size={28} />
                  </div>
                  
                  <p className="text-gray-700 font-medium mb-2">
                    Drag & drop your image here
                  </p>
                  <p className="text-gray-500 text-sm mb-6">or</p>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileInput}
                      disabled={uploading}
                    />
                    <div className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      {uploading ? 'Uploading...' : 'Browse Files'}
                    </div>
                  </label>
                  
                  <p className="text-gray-400 text-sm mt-4">
                    Supports JPG, PNG, WebP, GIF (Max 5MB)
                  </p>
                </div>
              </div>
              
              {uploading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <p className="text-blue-700">Uploading image...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column: Image Gallery */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Image Gallery ({images.length})
              </h2>
              {images.length > 0 && (
                <div className="text-sm text-gray-500">
                  Click on an image to preview
                </div>
              )}
            </div>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={`relative group border-2 rounded-lg overflow-hidden 
                              ${currentImage?.id === image.id ? 'border-blue-500' : 'border-gray-200'}
                              hover:border-blue-400 transition-all duration-200`}
                  >
                    {/* Image */}
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={image.url}
                        alt={image.originalName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      
                      {/* Current Badge */}
                      {currentImage?.id === image.id && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Check size={12} className="mr-1" />
                          Currently Displayed
                        </div>
                      )}
                      
                      {/* Delete Button */}
                      {/* Delete Button */}
<button
  onClick={() => deleteImage(image.id)}
  disabled={deletingId === image.id}
  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full 
           opacity-0 group-hover:opacity-100 transition-opacity duration-200
           hover:bg-red-600 disabled:opacity-50 z-20" 
>
  {deletingId === image.id ? (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
  ) : (
    <Trash2 size={16} />
  )}
</button>
                      
                      {/* Overlay Info */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-200 flex items-end p-3">
                        <div className="text-white">
                          <p className="font-medium text-sm truncate">{image.originalName}</p>
                          <p className="text-xs text-gray-300">
                            {formatFileSize(image.size)} • {formatDate(image.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-300 mb-4">
                  <Upload size={64} className="mx-auto" />
                </div>
                <h3 className="text-gray-500 font-medium text-lg mb-2">No images yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Upload your first image to start the rotation cycle. Images will automatically 
                  change on your homepage every 48 hours.
                </p>
              </div>
            )}
            
            {/* Image Stats */}
            {images.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Images</p>
                    <p className="text-2xl font-bold text-gray-800">{images.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Rotation Cycle</p>
                    <p className="text-2xl font-bold text-gray-800">48h</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Current Image</p>
                    <p className="text-xl font-bold text-gray-800 truncate">
                      {currentImage?.originalName || 'None'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Next Change</p>
                    <p className="text-lg font-bold text-blue-600">
                      {nextRotation || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
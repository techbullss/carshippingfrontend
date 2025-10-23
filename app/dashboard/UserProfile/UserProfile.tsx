"use client";

import { useState, useRef } from "react";
import { Camera, Save, Lock, User, Mail, Phone, RefreshCw } from "lucide-react";
import { useCurrentUser } from "@/app/Hookes/useCurrentUser";


export default function UserProfile() {
  const { user, loading: userLoading, error: userError, refetch } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Picture Upload
  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

     const response = await fetch(`https://api.f-carshipping.com/api/users/${user.id}/profile-picture`, {
  method: "POST",
  credentials: "include",
headers: { 'Accept': 'application/json' } ,
  body: formData,
});

      if (!response.ok) throw new Error("Failed to upload profile picture");

      const data = await response.json();
      setMessage("Profile picture updated successfully!");
      
      // Refresh user data to get updated profile picture
      refetch();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Failed to upload profile picture");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api.f-carshipping.com/api/users/${user.id}/password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setMessage("Password changed successfully!");
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">Failed to load user profile</div>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-blue-100">
            Welcome back, {user.firstName} {user.lastName}
          </p>
          <div className="flex items-center mt-2 text-blue-200 text-sm">
            <Mail className="w-4 h-4 mr-2" />
            {user.email}
            {user.roles && user.roles.length > 0 && (
              <span className="ml-4 px-2 py-1 bg-blue-500 rounded-full text-xs">
                {user.roles.join(", ")}
              </span>
            )}
          </div>
        </div>

        {/* Rest of your component remains the same */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Profile Picture
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
          </nav>
        </div>

        {/* Messages */}
        {message && (
          <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{message}</p>
          </div>
        )}

        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Profile Picture Tab */}
        {activeTab === "profile" && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  className="hidden"
                />
                
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Click the camera icon to update your photo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG • Max 5MB
                </p>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-3" />
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your current password"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Password Requirements</h4>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Minimum 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: string[];
  createdAt: string;
  newsletter: boolean;
  city: string;
  country: string;
  status: string;
  dateOfBirth: string;
  gender: string;
  streetAddress: string;
  state: string;
  postalCode: string;
  sourceCountry: string;
  destinationCountry: string;
  passportPhoto: string;
  govtId: string;
  idNumber: string;
  emailVerified: boolean;
  shippingFrequency: string;
  vehicleType: string;
  estimatedShippingDate: string;
  verificationCode: string;
  preferredCommunication: string[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://api.f-carshipping.com/api/admin/users",{
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const response = await fetch(`https://api.f-carshipping.com/api/admin/users/${updatedUser.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Failed to update user");

      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`https://api.f-carshipping.com/api/admin/users/${userToDelete.id}`, {
        credentials: "include",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter(user => user.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const toggleRole = async (userId: number, role: string) => {
    const user = users.find((u) => u.id === userId);
    const hasRole = user?.roles.includes(role);
    const action = hasRole ? "remove" : "add";

    try {
      const response = await fetch(`https://api.f-carshipping.com/api/admin/users/roles/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} role`);
      }

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updatedUser : u))
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      const response = await fetch(`https://api.f-carshipping.com/api/admin/users/approve/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to approve user");

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: "approved" } : user
      ));
    } catch (err) {
      setError("Failed to approve user");
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-blue-100 text-sm">{user.email}</p>
                    <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status || "Pending"}
                    </p>
                  </div>
                  
                </div>
                
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{user.city}, {user.country}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Joined:</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Roles */}
                <div>
                  <span className="text-gray-500 text-sm">Roles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          role === "ADMIN"
                            ? "bg-red-100 text-red-800"
                            : role === "SELLER"
                            ? "bg-blue-100 text-blue-800"
                            : role === "ASSISTANT"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {role}
                        <button
                          onClick={() => toggleRole(user.id, role)}
                          className="ml-1 text-xs hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Newsletter Status */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Newsletter:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.newsletter
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.newsletter ? "Subscribed" : "Not Subscribed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer - Actions */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewDetails(user)}
                  className="flex-1 min-w-[120px] bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                
                {user.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="flex-1 min-w-[120px] bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                )}
                
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 min-w-[80px] bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(user)}
                  className="flex-1 min-w-[80px] bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>

              {/* Add Role Dropdown */}
              <div className="mt-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleRole(user.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full text-xs border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Add Role...</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SELLER">SELLER</option>
                  <option value="ASSISTANT">ASSISTANT</option>
                  <option value="USER">USER</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Details Drawer */}
      {drawerOpen && selectedUser && (
        <UserDetailsDrawer
          user={selectedUser}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <DeleteConfirmationModal
          user={userToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
}

// User Details Drawer Component
interface UserDetailsDrawerProps {
  user: User;
  onClose: () => void;
}

function UserDetailsDrawer({ user, onClose }: UserDetailsDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0  bg-opacity-5" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-blue-100">{user.email}</p>
                <p className="text-blue-100">{user.phone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
              
              <InfoField label="First Name" value={user.firstName} />
              <InfoField label="Last Name" value={user.lastName} />
              <InfoField label="Email" value={user.email} />
              <InfoField label="Phone" value={user.phone} />
              <InfoField label="Date of Birth" value={user.dateOfBirth} />
              <InfoField label="Gender" value={user.gender} />
              <InfoField label="ID Number" value={user.idNumber} />
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Email Verified:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Address Information</h3>
              
              <InfoField label="Street Address" value={user.streetAddress} />
              <InfoField label="City" value={user.city} />
              <InfoField label="State" value={user.state} />
              <InfoField label="Postal Code" value={user.postalCode} />
              <InfoField label="Country" value={user.country} />
              <InfoField label="Source Country" value={user.sourceCountry} />
              <InfoField label="Destination Country" value={user.destinationCountry} />
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Shipping Information</h3>
              
              <InfoField label="Shipping Frequency" value={user.shippingFrequency} />
              <InfoField label="Vehicle Type" value={user.vehicleType} />
              <InfoField label="Estimated Shipping Date" value={user.estimatedShippingDate} />
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Newsletter:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.newsletter ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {user.newsletter ? "Subscribed" : "Not Subscribed"}
                </span>
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents</h3>
              
              {user.passportPhoto && (
                <DocumentPreview 
                  label="Passport Photo" 
                  url={user.passportPhoto} 
                  type="image"
                />
              )}
              
              {user.govtId && (
                <DocumentPreview 
                  label="Government ID" 
                  url={user.govtId} 
                  type={user.govtId.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'}
                />
              )}
              
              {!user.passportPhoto && !user.govtId && (
                <p className="text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h3>
              
              <InfoField label="Status" value={user.status || "Pending"} />
              <InfoField label="Verification Code" value={user.verificationCode} />
              <InfoField label="Created At" value={new Date(user.createdAt).toLocaleString()} />
              <InfoField label="Roles" value={user.roles.join(", ")} />
              
              {user.preferredCommunication && user.preferredCommunication.length > 0 && (
                <InfoField 
                  label="Preferred Communication" 
                  value={user.preferredCommunication.join(", ")} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Info Fields
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <p className="text-sm text-gray-900 mt-1">{value || "Not provided"}</p>
    </div>
  );
}

// Document Preview Component
function DocumentPreview({ label, url, type }: { label: string; url: string; type: 'image' | 'pdf' }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="border rounded-lg p-3">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <div className="mt-2 flex items-center space-x-3">
        {type === 'image' ? (
          <img 
            src={url} 
            alt={label}
            className="h-16 w-16 object-cover rounded border cursor-pointer hover:opacity-80"
            onClick={() => setIsPreviewOpen(true)}
          />
        ) : (
          <div 
            className="h-16 w-16 bg-red-100 rounded border flex items-center justify-center cursor-pointer hover:bg-red-200"
            onClick={() => setIsPreviewOpen(true)}
          >
            <span className="text-red-600 font-bold text-sm">PDF</span>
          </div>
        )}
        <button
          onClick={() => window.open(url, '_blank')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Full Document
        </button>
      </div>

      {/* Full Screen Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {type === 'image' ? (
              <img 
                src={url} 
                alt={label}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <iframe 
                src={url} 
                className="w-full h-96 bg-white"
                title={label}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Delete Confirmation Modal
interface DeleteConfirmationModalProps {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({ user, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-red-600">Delete User</h2>
          <p className="mb-4">
            Are you sure you want to delete {user.firstName} {user.lastName}? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit User Modal
interface EditUserModalProps {
  user: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

function EditUserModal({ user, onSave, onClose }: EditUserModalProps) {
  const [formData, setFormData] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Newsletter Subscribed</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
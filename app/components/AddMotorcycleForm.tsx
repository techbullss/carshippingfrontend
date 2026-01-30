"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "../Hookes/useCurrentUser";

export default function AddMotorcycleForm({
  open,
  onClose,
  onSuccess,
  motorcycleToEdit,
  currentUserEmail,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  motorcycleToEdit?: any | null;
  currentUserEmail?: string;
}) {
    const { user: currentUser } = useCurrentUser();

  const [form, setForm] = useState({
    brand: "",
    model: "",
    type: "",
    engineCapacity: "",
    price: "",
    location: "",
    owner: currentUser?.email || currentUserEmail || "",
    description: "",
    year: "",
    status: "PENDING", // Default status for new motorcycles
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const makes = [
    "Honda",
    "Yamaha",
    "Kawasaki",
    "Suzuki",
    "BMW",
    "Ducati",
    "Triumph",
    "Harley-Davidson",
    "KTM",
    "Royal Enfield",
    "Bajaj",
    "Hero",
    "TVS",
    "Other",
  ];

  const modelsByMake: Record<string, string[]> = {
    Honda: ["CBR 500R", "CB 650R", "Africa Twin", "Other"],
    Yamaha: ["R15", "MT-07", "Tenere 700", "Other"],
    Kawasaki: ["Ninja 400", "Z650", "Versys 650", "Other"],
    Suzuki: ["GSX-R600", "V-Strom 650", "Burgman 400", "Other"],
    BMW: ["R1250 GS", "S1000RR", "F850 GS", "Other"],
    Ducati: ["Panigale V2", "Monster 821", "Scrambler", "Other"],
    Triumph: ["Street Triple", "Tiger 900", "Bonneville T120", "Other"],
    "Harley-Davidson": ["Iron 883", "Street Glide", "Fat Boy", "Other"],
    KTM: ["Duke 390", "Adventure 790", "RC 200", "Other"],
    "Royal Enfield": ["Classic 350", "Himalayan", "Interceptor 650", "Other"],
    Bajaj: ["Pulsar 220F", "Dominar 400", "Boxer 150", "Other"],
    Hero: ["Splendor Plus", "Xpulse 200", "Glamour", "Other"],
    TVS: ["Apache RTR 160", "Ntorq 125", "Raider 125", "Other"],
    Other: ["Other"],
  };

  const types = [
    "Sport",
    "Cruiser",
    "Touring",
    "Adventure",
    "Standard",
    "Off-road",
    "Scooter",
    "Cafe Racer",
    "Other",
  ];

  const statusOptions = ["PENDING", "APPROVED", "REJECTED"];
  
  // Only show status field for editing existing motorcycles (admins can change status)
  const showStatusField = motorcycleToEdit && 
    (currentUser?.roles?.[0] === "ADMIN" || currentUser?.roles?.[0] === "ROLE_ADMIN");

  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);

  const availableFeatures = [
    "ABS",
    "Traction Control",
    "Quick Shifter",
    "Heated Grips",
    "Bluetooth Connectivity",
    "Crash Guards",
    "LED Headlights",
    "Navigation",
    "Adjustable Suspension",
  ];

  useEffect(() => {
    if (motorcycleToEdit) {
      setForm({
        brand: motorcycleToEdit.brand || "",
        model: motorcycleToEdit.model || "",
        type: motorcycleToEdit.type || "",
        engineCapacity: motorcycleToEdit.engineCapacity?.toString() || "",
        status: motorcycleToEdit.status || "PENDING",
        price: motorcycleToEdit.price?.toString() || "",
        location: motorcycleToEdit.location || "",
        owner: motorcycleToEdit.owner || currentUser?.email || currentUserEmail || "",
        description: motorcycleToEdit.description || "",
        year: motorcycleToEdit.year?.toString() || "",
      });
      setFeatures(motorcycleToEdit.features || []);
      setPreviews(motorcycleToEdit.imageUrls || []);
      setImages([]); // Clear images for edit (backend will handle existing images)
    } else {
      setForm({
        brand: "",
        model: "",
        type: "",
        engineCapacity: "",
        status: "PENDING",
        price: "",
        location: "",
        owner: currentUser?.email || currentUserEmail || "",
        description: "",
        year: "",
      });
      setFeatures([]);
      setPreviews([]);
      setImages([]);
    }
    setError("");
  }, [motorcycleToEdit, open, currentUser, currentUserEmail]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Validate file size (max 5MB per file)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      setError("Some files exceed 5MB size limit and were ignored.");
    }
    
    setImages((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...validFiles.map((f) => URL.createObjectURL(f))]);
  };

  const removePreview = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Clean up object URL
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const addFeature = (feature: string) => {
    if (feature && !features.includes(feature)) {
      setFeatures((prev) => [...prev, feature]);
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures((prev) => prev.filter((f) => f !== feature));
  };

  const handleCustomFeatureAdd = () => {
    if (customFeature.trim() !== "") {
      addFeature(customFeature.trim());
      setCustomFeature("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!form.brand || !form.model || !form.price || !form.year) {
      setError("Please fill in all required fields: Brand, Model, Price, and Year");
      setLoading(false);
      return;
    }

    try {
      // Prepare DTO object matching your backend MotorcycleRequestDTO
      const motorcycleData = {
        brand: form.brand,
        model: form.model,
        type: form.type || null,
        engineCapacity: form.engineCapacity ? Number(form.engineCapacity) : null,
        status: form.status,
        price: Number(form.price),
        location: form.location || null,
        owner: form.owner,
        description: form.description || null,
        year: Number(form.year),
        features: features.length > 0 ? features : null,
      };

      const fd = new FormData();
      
      // Append motorcycle data as JSON
      fd.append(
        "motorcycle",
        new Blob([JSON.stringify(motorcycleData)], { type: "application/json" })
      );
      
      // Append images if any
      images.forEach((file) => {
        fd.append("images", file);
      });

      const url = motorcycleToEdit
        ? `https://api.f-carshipping.com/api/motorcycles/${motorcycleToEdit.id}`
        : "https://api.f-carshipping.com/api/motorcycles";
      
      const method = motorcycleToEdit ? "PUT" : "POST";

      console.log("Submitting motorcycle data:", motorcycleData);
      console.log("Images count:", images.length);

      const res = await fetch(url, {
        method,
        body: fd,
        credentials: "include",
      
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response error:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: ${res.statusText}`);
        } catch {
          throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
        }
      }

      const response = await res.json();
      console.log("Success response:", response);
      
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError(err.message || "Failed to save motorcycle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modelOptions = form.brand
    ? modelsByMake[form.brand] || ["Other"]
    : [];

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !loading && onClose()}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative ml-auto w-full max-w-2xl bg-white rounded-l-2xl shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {motorcycleToEdit ? "Edit Motorcycle" : "Add Motorcycle"}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => !loading && onClose()}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 flex-1 overflow-y-auto space-y-6"
            >
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* User Info Display */}
              {currentUser && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Logged in as:</span> {currentUser.email}
                    {currentUser.roles && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {currentUser.roles[0]}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Status Field (only for admins editing) */}
              {showStatusField && (
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Required Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Make (Required) */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Make <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Make</option>
                    {makes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Model (Required) */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    disabled={!form.brand}
                    required
                  >
                    <option value="">Select Model</option>
                    {modelOptions.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    {types.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Year (Required) */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Engine Capacity */}
                <div>
                  <label className="block text-sm font-medium mb-1">Engine Capacity (cc)</label>
                  <input
                    name="engineCapacity"
                    type="number"
                    value={form.engineCapacity}
                    onChange={handleChange}
                    placeholder="e.g., 650"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                {/* Price (Required) */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (KES) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g., 450000"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., Nairobi, Mombasa"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Owner (Read-only if logged in) */}
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <input
                  name="owner"
                  value={form.owner}
                  onChange={handleChange}
                  placeholder="Owner email"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly={!!currentUser}
                />
                {currentUser && (
                  <p className="text-xs text-gray-500 mt-1">Owner is automatically set to your account</p>
                )}
              </div>

              {/* Features Section */}
              <div>
                <label className="block font-medium mb-2 text-gray-800">
                  Features
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => addFeature(feature)}
                      className={`px-3 py-1 rounded-full border text-sm ${
                        features.includes(feature)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom feature"
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomFeatureAdd())}
                    className="border rounded-md px-3 py-2 flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleCustomFeatureAdd}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span
                      key={f}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => removeFeature(f)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the motorcycle's condition, history, and any other details..."
                  className="w-full border rounded-md px-3 py-2 h-28 focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">
                  Images (Max 5MB each)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  className="block w-full text-sm border rounded-md p-2"
                />
                <p className="text-xs text-gray-500 mt-1">Upload clear photos of the motorcycle</p>
                
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative rounded-md overflow-hidden border group"
                    >
                      <img
                        src={src}
                        alt={`preview-${i}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Status */}
              <div className="text-sm text-gray-600">
                <p>Status: New motorcycles will be marked as <span className="font-medium">PENDING</span> for admin approval.</p>
                {motorcycleToEdit && (
                  <p className="mt-1">Editing motorcycle ID: {motorcycleToEdit.id}</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border hover:bg-gray-100"
                  onClick={() => !loading && onClose()}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading
                    ? "Saving..."
                    : motorcycleToEdit
                    ? "Update Motorcycle"
                    : "Add Motorcycle"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
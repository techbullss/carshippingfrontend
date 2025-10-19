"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddMotorcycleForm({
  open,
  onClose,
  onSuccess,
  motorcycleToEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  motorcycleToEdit?: any | null;
}) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    type: "",
    engineCapacity: "",
    status: "Available",
    price: "",
    location: "",
    locationType: "Local (Kenya)",
    owner: "",
    fuelType: "",
    description: "",
    year: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const [loading, setLoading] = useState(false);

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

  const ownerTypes = ["First Owner", "Second Owner", "Third Owner", "Other"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const locationTypes = ["Local (Kenya)", "Import (Abroad)"];

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

  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);

  useEffect(() => {
    if (motorcycleToEdit) {
      setForm({
        brand: motorcycleToEdit.brand || "",
        model: motorcycleToEdit.model || "",
        type: motorcycleToEdit.type || "",
        engineCapacity: motorcycleToEdit.engineCapacity?.toString() || "",
        status: motorcycleToEdit.status || "Available",
        price: motorcycleToEdit.price?.toString() || "",
        location: motorcycleToEdit.location || "",
        locationType: motorcycleToEdit.locationType || "Local (Kenya)",
        owner: motorcycleToEdit.owner || "",
        fuelType: motorcycleToEdit.fuelType || "",
        description: motorcycleToEdit.description || "",
        year: motorcycleToEdit.year?.toString() || "",
      });
      setFeatures(motorcycleToEdit.features || []);
      setPreviews(motorcycleToEdit.imageUrls || []);
    } else {
      setForm({
        brand: "",
        model: "",
        type: "",
        engineCapacity: "",
        status: "Available",
        price: "",
        location: "",
        locationType: "Local (Kenya)",
        owner: "",
        fuelType: "",
        description: "",
        year: "",
      });
      setFeatures([]);
      setPreviews([]);
    }
    setImages([]);
  }, [motorcycleToEdit, open]);

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
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removePreview = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
    try {
      const payload = {
        ...form,
        engineCapacity: form.engineCapacity ? Number(form.engineCapacity) : null,
        price: form.price ? Number(form.price) : null,
        features,
      };

      const fd = new FormData();
      fd.append(
        "motorcycle",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      images.forEach((f) => fd.append("images", f));

      const url = motorcycleToEdit
        ? `https://api.f-carshipping.com/api/motorcycles/${motorcycleToEdit.id}`
        : "https://api.f-carshipping.com/api/motorcycles";
      const method = motorcycleToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: fd,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save motorcycle");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const modelOptions = form.brand
    ? modelsByMake[form.brand] || ["Other"]
    : [];

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
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 flex-1 overflow-y-auto space-y-6"
            >
              {/* Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Make */}
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Make</option>
                  {makes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>

                {/* Model */}
                <select
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  disabled={!form.brand}
                >
                  <option value="">Select Model</option>
                  {modelOptions.map((model) => (
                    <option key={model}>{model}</option>
                  ))}
                </select>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {types.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                <select
                  name="fuelType"
                  value={form.fuelType}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>

                <select
                  name="owner"
                  value={form.owner}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Ownership</option>
                  {ownerTypes.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>

                <input
                  name="engineCapacity"
                  value={form.engineCapacity}
                  onChange={handleChange}
                  placeholder="Engine CC"
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <select
                  name="locationType"
                  value={form.locationType}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {locationTypes.map((lt) => (
                    <option key={lt}>{lt}</option>
                  ))}
                </select>
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

              {/* Description & Price */}
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded-md px-3 py-2 h-28 focus:ring-2 focus:ring-blue-500"
              />

              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price (KES)"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location (e.g. Nairobi)"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  className="block w-full text-sm"
                />
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

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border hover:bg-gray-100"
                  onClick={() => !loading && onClose()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
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

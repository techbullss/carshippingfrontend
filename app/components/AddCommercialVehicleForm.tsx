"use client";

import { useState, useEffect } from "react";
import { CommercialVehicle } from "../CommercialVehicle";

interface AddCommercialVehicleFormProps {
  onSuccess: () => void;
  vehicleToEdit?: CommercialVehicle | null;
  onCancel: () => void;
}

export default function AddCommercialVehicleForm({
  onSuccess,
  vehicleToEdit,
  onCancel,
}: AddCommercialVehicleFormProps) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    type: "",
    yearOfManufacture: "",
    conditionType: "",
    bodyType: "",
    color: "",
    engineType: "",
    engineCapacityCc: "",
    fuelType: "",
    transmission: "",
    seats: "",
    doors: "",
    mileageKm: "",
    payloadCapacityKg: "",
    cargoVolumeM3: "",
    sleeperCapacity: "",
    camperFeatures: "",
    priceKes: "",
    description: "",
    location: "",
    ownerType: "",
    features: "",
    customSpecs: "",
    imageUrls: [] as string[],
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customSpecsList, setCustomSpecsList] = useState<{ key: string; value: string }[]>([]);
  const [newCustomSpec, setNewCustomSpec] = useState({ key: "", value: "" });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Populate when editing
  useEffect(() => {
    if (vehicleToEdit) {
      setForm({
        brand: vehicleToEdit.brand || "",
        model: vehicleToEdit.model || "",
        type: vehicleToEdit.type || "",
        yearOfManufacture: vehicleToEdit.yearOfManufacture || "",
        conditionType: vehicleToEdit.conditionType || "",
        bodyType: vehicleToEdit.bodyType || "",
        color: vehicleToEdit.color || "",
        engineType: vehicleToEdit.engineType || "",
        engineCapacityCc: vehicleToEdit.engineCapacityCc || "",
        fuelType: vehicleToEdit.fuelType || "",
        transmission: vehicleToEdit.transmission || "",
        seats: vehicleToEdit.seats || "",
        doors: vehicleToEdit.doors || "",
        mileageKm: vehicleToEdit.mileageKm || "",
        payloadCapacityKg: vehicleToEdit.payloadCapacityKg || "",
        cargoVolumeM3: vehicleToEdit.cargoVolumeM3 || "",
        sleeperCapacity: vehicleToEdit.sleeperCapacity || "",
        camperFeatures: vehicleToEdit.camperFeatures || "",
        priceKes: vehicleToEdit.priceKes?.toString() || "",
        description: vehicleToEdit.description || "",
        location: vehicleToEdit.location || "",
        ownerType: vehicleToEdit.ownerType || "",
        features: vehicleToEdit.features || "",
        customSpecs: vehicleToEdit.customSpecs || "",
        imageUrls: vehicleToEdit.imageUrls || [],
      });

      if (vehicleToEdit.features) {
        setSelectedFeatures(vehicleToEdit.features.split(", ").filter(Boolean));
      }

      if (vehicleToEdit.customSpecs) {
        try {
          const specs = JSON.parse(vehicleToEdit.customSpecs);
          if (Array.isArray(specs)) setCustomSpecsList(specs);
          else if (typeof specs === "object") {
            setCustomSpecsList(Object.entries(specs).map(([k, v]) => ({ key: k, value: String(v) })));
          }
        } catch {
          setCustomSpecsList([{ key: "Additional Info", value: vehicleToEdit.customSpecs }]);
        }
      }
    }
  }, [vehicleToEdit]);

  // ---------- OPTIONS ----------
  const vehicleTypes = ["Truck", "Bus", "Van", "Trailer", "Camper Van", "Other"];
  const conditions = ["New", "Used", "Certified Pre-Owned"];
  const bodyTypes = ["Chassis Cab", "Box Truck", "Flatbed", "Minibus", "Panel Van", "Camper Van"];
  const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
  const fuelTypes = ["Diesel", "Petrol", "Hybrid", "Electric", "CNG"];
  const ownerTypes = ["Individual", "Dealer", "Company"];

  const essentialFeatures = [
    "Air Conditioning",
    "Power Steering",
    "Power Windows",
    "Central Locking",
    "ABS Brakes",
    "Alloy Wheels",
    "Fog Lights",
    "Rear Parking Sensors",
    "Rear View Camera",
    "Navigation System",
    "Bluetooth",
    "Tow Hitch",
    "Roof Rack",
    "Cargo Racks",
    "Reinforced Suspension",
    "Camper Equipment",
  ];

  // ---------- HANDLERS ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeNewImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const addCustomSpec = () => {
    if (newCustomSpec.key && newCustomSpec.value) {
      setCustomSpecsList((p) => [...p, { ...newCustomSpec }]);
      setNewCustomSpec({ key: "", value: "" });
    }
  };

  const removeCustomSpec = (i: number) => {
    setCustomSpecsList((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.brand || !form.model || !form.priceKes) {
      setError("Brand, model, and price are required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      const payload = {
        ...form,
        priceKes: Number(form.priceKes),
        features: selectedFeatures.join(", "),
        customSpecs: JSON.stringify(customSpecsList),
      };

      formData.append(
        "vehicle",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      images.forEach((f) => formData.append("images", f));

      const url = vehicleToEdit
        ? `https://carshipping.duckdns.org:8443/api/vehicles/${vehicleToEdit.id}`
        : "https://carshipping.duckdns.org:8443/api/vehicles";

      const method = vehicleToEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, credentials: 'include', body: formData });
      if (!res.ok) throw new Error(await res.text());

      alert(vehicleToEdit ? "Vehicle updated!" : "Vehicle added!");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="p-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {vehicleToEdit ? "Edit Commercial Vehicle" : "Add Commercial Vehicle"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <div className="bg-white p-4 rounded border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand *" required className="border p-2 rounded"/>
            <input name="model" value={form.model} onChange={handleChange} placeholder="Model *" required className="border p-2 rounded"/>
            <input name="yearOfManufacture" value={form.yearOfManufacture} onChange={handleChange} placeholder="Year of Manufacture" className="border p-2 rounded"/>
            <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="border p-2 rounded"/>
            <input name="engineType" value={form.engineType} onChange={handleChange} placeholder="Engine Type" className="border p-2 rounded"/>
            <input name="engineCapacityCc" value={form.engineCapacityCc} onChange={handleChange} placeholder="Engine Capacity (CC)" className="border p-2 rounded"/>
            <input name="seats" value={form.seats} onChange={handleChange} placeholder="Seats" className="border p-2 rounded"/>
            <input name="doors" value={form.doors} onChange={handleChange} placeholder="Doors" className="border p-2 rounded"/>
            <input name="mileageKm" value={form.mileageKm} onChange={handleChange} placeholder="Mileage (Km)" className="border p-2 rounded"/>
            <input name="payloadCapacityKg" value={form.payloadCapacityKg} onChange={handleChange} placeholder="Payload Capacity (Kg)" className="border p-2 rounded"/>
            <input name="cargoVolumeM3" value={form.cargoVolumeM3} onChange={handleChange} placeholder="Cargo Volume (m³)" className="border p-2 rounded"/>
            <input name="sleeperCapacity" value={form.sleeperCapacity} onChange={handleChange} placeholder="Sleeper Capacity" className="border p-2 rounded"/>
            <input name="camperFeatures" value={form.camperFeatures} onChange={handleChange} placeholder="Camper Features" className="border p-2 rounded"/>
            <input name="priceKes" value={form.priceKes} onChange={handleChange} placeholder="Price (KES) *" required className="border p-2 rounded"/>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border p-2 rounded"/>
            <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select Type</option>
              {vehicleTypes.map((v) => <option key={v}>{v}</option>)}
            </select>
            <select name="conditionType" value={form.conditionType} onChange={handleChange} className="border p-2 rounded">
              <option value="">Condition</option>
              {conditions.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select name="bodyType" value={form.bodyType} onChange={handleChange} className="border p-2 rounded">
              <option value="">Body Type</option>
              {bodyTypes.map((b) => <option key={b}>{b}</option>)}
            </select>
            <select name="transmission" value={form.transmission} onChange={handleChange} className="border p-2 rounded">
              <option value="">Transmission</option>
              {transmissions.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select name="fuelType" value={form.fuelType} onChange={handleChange} className="border p-2 rounded">
              <option value="">Fuel Type</option>
              {fuelTypes.map((f) => <option key={f}>{f}</option>)}
            </select>
            <select name="ownerType" value={form.ownerType} onChange={handleChange} className="border p-2 rounded">
              <option value="">Owner Type</option>
              {ownerTypes.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded"/>
        </div>

        {/* IMAGE UPLOADS */}
        <div className="bg-white p-4 rounded border space-y-4">
          <h3 className="font-semibold">Images</h3>

          {/* Upload new */}
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />

          {/* Preview NEW images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {images.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${i}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Preview EXISTING images */}
          {form.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {form.imageUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`existing-${i}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* FEATURES */}
        <div className="bg-white p-4 rounded border space-y-2">
          <h3 className="font-semibold">Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {essentialFeatures.map((f) => (
              <label key={f} className="flex items-center space-x-2">
                <input type="checkbox" checked={selectedFeatures.includes(f)} onChange={() => handleFeatureToggle(f)} />
                <span>{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CUSTOM SPECS */}
        <div className="bg-white p-4 rounded border space-y-2">
          <h3 className="font-semibold">Custom Specs</h3>
          {customSpecsList.map((spec, i) => (
            <div key={i} className="flex items-center space-x-2">
              <input type="text" value={spec.key} readOnly className="border p-2 rounded w-1/3"/>
              <input type="text" value={spec.value} readOnly className="border p-2 rounded w-2/3"/>
              <button type="button" onClick={() => removeCustomSpec(i)} className="text-red-600">✕</button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input type="text" placeholder="Key" value={newCustomSpec.key} onChange={(e) => setNewCustomSpec((p) => ({ ...p, key: e.target.value }))} className="border p-2 rounded w-1/3"/>
            <input type="text" placeholder="Value" value={newCustomSpec.value} onChange={(e) => setNewCustomSpec((p) => ({ ...p, value: e.target.value }))} className="border p-2 rounded w-2/3"/>
            <button type="button" onClick={addCustomSpec} className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between">
          <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded">
            {vehicleToEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

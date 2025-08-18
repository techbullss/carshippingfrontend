"use client";

import { useState } from "react";

export default function AddCarForm() {
  // Form state
  const [form, setForm] = useState({
    brand: "",
    model: "",
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
    priceKes: "",
    description: "",
    location: "",
    highBreed: false,
    engineCapacityUnit: "cc",
    trimLevel: "",
    horsepower: "",
    torque: "",
    acceleration: "",
    topSpeed: "",
    driveType: "",
    infotainmentSystem: "",
    soundSystem: "",
    fuelEfficiency: "",
    warranty: "",
    serviceHistory: "",
    // Will be populated from checkboxes
    safetyFeatures: "",
    luxuryFeatures: "",
    exteriorFeatures: "",
    interiorFeatures: ""
  });

  // Feature selections
  const [selectedSafetyFeatures, setSelectedSafetyFeatures] = useState<string[]>([]);
  const [selectedLuxuryFeatures, setSelectedLuxuryFeatures] = useState<string[]>([]);
  const [selectedExteriorFeatures, setSelectedExteriorFeatures] = useState<string[]>([]);
  const [selectedInteriorFeatures, setSelectedInteriorFeatures] = useState<string[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Constants
  const europeanBrands = [
    "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Volvo", "Porsche",
    "Land Rover", "Jaguar", "Peugeot", "Renault", "Fiat", "Skoda",
    "Alfa Romeo", "Aston Martin", "Bentley", "Bugatti", "Ferrari",
    "Lamborghini", "Lotus", "Maserati", "McLaren", "Mini", "Rolls-Royce"
  ];

  const colors = [
    "Black", "White", "Silver", "Blue", "Red", "Grey", "Green", 
    "Gold", "Brown", "Yellow", "Orange", "Purple", "Bronze", "Chrome"
  ];

  const driveTypes = ["RWD", "FWD", "AWD", "4WD", "4MATIC", "xDrive", "Quattro", "S-Tronic"];
  const trimLevels = ["Base", "Luxury", "Sport", "AMG Line", "M Sport", "S Line", 
                     "R-Dynamic", "Performance", "Edition", "Black Series", "RS", "GT"];

  // Feature options for European vehicles
  const featureOptions = {
    safety: [
      "Adaptive Cruise Control",
      "Lane Keeping Assist",
      "Automatic Emergency Braking",
      "Self-Parking System",
      "Blind Spot Monitoring",
      "360° Camera System",
      "Night Vision Assist",
      "Traffic Sign Recognition",
      "Crosswind Assist",
      "Pre-Safe System",
      "Tire Pressure Monitoring",
      "ISOFIX Child Seat Anchors",
      "Emergency Call System",
      "Attention Assist",
      "Rear Cross Traffic Alert"
    ],
    luxury: [
      "Ambient Lighting",
      "Massage Seats",
      "Ventilated Seats",
      "Heated Seats",
      "Heated Steering Wheel",
      "Soft-Close Doors",
      "Air Suspension",
      "Head-Up Display",
      "Panoramic Sunroof",
      "Power Tailgate",
      "Keyless Entry",
      "Remote Start",
      "Cooled Glovebox",
      "Fragrance System",
      "Rear Sunshades"
    ],
    exterior: [
      "LED Matrix Headlights",
      "Panoramic Glass Roof",
      "AMG Body Kit",
      "M Sport Package",
      "Tinted Windows",
      "Power Folding Mirrors",
      "Acoustic Glass",
      "Alloy Wheels (19\"+)",
      "Run-Flat Tires",
      "Rain-Sensing Wipers",
      "Auto-Dimming Mirrors",
      "Deployable Tow Hook",
      "Rear Spoiler",
      "Carbon Fiber Exterior",
      "Soft-Close Doors"
    ],
    interior: [
      "Nappa Leather",
      "Alcantara Headliner",
      "Wood Trim",
      "Metal Accents",
      "Digital Cockpit",
      "Multicontour Seats",
      "Memory Seats",
      "Wireless Charging",
      "Rear Entertainment",
      "Apple CarPlay/Android Auto",
      "Gesture Control",
      "Touchpad Controller",
      "Augmented Reality Nav",
      "Premium Floor Mats",
      "Carbon Fiber Trim"
    ]
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const getCapacityInCc = () => {
    const v = form.engineCapacityCc;
    if (!v) return null;
    const num = Number(v);
    if (isNaN(num) || num <= 0) return null;
    return form.engineCapacityUnit === "L" ? Math.round(num * 1000) : Math.round(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!form.brand || !form.model || !form.priceKes) {
      setError("Please fill brand, model and price.");
      setLoading(false);
      return;
    }

    const engine_capacity_cc = getCapacityInCc();
    if (form.engineCapacityCc && !engine_capacity_cc) {
      setError("Engine capacity must be a positive number.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      const carData = {
        ...form,
        engineCapacity: engine_capacity_cc || form.engineCapacityCc,
        safetyFeatures: selectedSafetyFeatures.join(", "),
        luxuryFeatures: selectedLuxuryFeatures.join(", "),
        exteriorFeatures: selectedExteriorFeatures.join(", "),
        interiorFeatures: selectedInteriorFeatures.join(", ")
      };
      
      formData.append("car", new Blob([JSON.stringify(carData)], { type: "application/json" }));

      images.forEach(file => formData.append("images", file));

      const res = await fetch("http://localhost:8080/api/cars", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Premium vehicle listed successfully!");
      // Reset form
      setForm({
        brand: "",
        model: "",
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
        priceKes: "",
        description: "",
        location: "",
        highBreed: false,
        engineCapacityUnit: "cc",
        trimLevel: "",
        horsepower: "",
        torque: "",
        acceleration: "",
        topSpeed: "",
        driveType: "",
        infotainmentSystem: "",
        soundSystem: "",
        fuelEfficiency: "",
        warranty: "",
        serviceHistory: "",
        safetyFeatures: "",
        luxuryFeatures: "",
        exteriorFeatures: "",
        interiorFeatures: ""
      });
      setSelectedSafetyFeatures([]);
      setSelectedLuxuryFeatures([]);
      setSelectedExteriorFeatures([]);
      setSelectedInteriorFeatures([]);
      setImages([]);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Feature checkbox component
  const FeatureCheckboxGroup = ({
    title,
    options,
    selected,
    onChange
  }: {
    title: string;
    options: string[];
    selected: string[];
    onChange: (features: string[]) => void;
  }) => (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map(feature => (
          <div key={feature} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`${title}-${feature}`}
                name={`${title}-${feature}`}
                type="checkbox"
                checked={selected.includes(feature)}
                onChange={() => onChange(
                  selected.includes(feature)
                    ? selected.filter(f => f !== feature)
                    : [...selected, feature]
                )}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={`${title}-${feature}`} className="font-medium text-gray-700">
                {feature}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">List Your Premium European Vehicle</h2>
        <p className="text-gray-600">Complete all details to showcase your vehicle to discerning buyers</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Manufacturer*</label>
              <select 
                name="brand" 
                value={form.brand} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select European Brand</option>
                {europeanBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Model*</label>
              <input 
                name="model" 
                value={form.model} 
                onChange={handleChange} 
                placeholder="e.g., A4, 320i, E-Class" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Model Year</label>
              <input 
                name="yearOfManufacture" 
                type="number" 
                min="1900" 
                max={new Date().getFullYear() + 1}
                value={form.yearOfManufacture} 
                onChange={handleChange} 
                placeholder="e.g., 2022" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Vehicle Condition</label>
              <select 
                name="conditionType" 
                value={form.conditionType} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Body Style</label>
              <select 
                name="bodyType" 
                value={form.bodyType} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Body Type</option>
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="SUV">SUV</option>
                <option value="Wagon">Wagon</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Roadster">Roadster</option>
                <option value="Limousine">Limousine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Trim Level</label>
              <select 
                name="trimLevel" 
                value={form.trimLevel} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Trim Level</option>
                {trimLevels.map(trim => (
                  <option key={trim} value={trim}>{trim}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Exterior Color</label>
              <select 
                name="color" 
                value={form.color} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Color</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Drive Type</label>
              <select 
                name="driveType" 
                value={form.driveType} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Drive Type</option>
                {driveTypes.map(drive => (
                  <option key={drive} value={drive}>{drive}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Engine Details - Fixed spacing */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Engine Configuration</label>
              <input 
                name="engineType" 
                value={form.engineType} 
                onChange={handleChange} 
                placeholder="e.g., V6, I4, W12" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Engine Capacity</label>
              <div className="flex gap-2">
                <input
                  name="engineCapacityCc"
                  value={form.engineCapacityCc}
                  onChange={handleChange}
                  placeholder="e.g., 2.0"
                  className="w-3/4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  inputMode="decimal"
                />
                <select 
                  name="engineCapacityUnit" 
                  value={form.engineCapacityUnit} 
                  onChange={handleChange} 
                  className="w-1/4 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="cc">cc</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Horsepower (HP)</label>
              <input 
                name="horsepower" 
                value={form.horsepower} 
                onChange={handleChange} 
                placeholder="e.g., 362" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Torque (Nm)</label>
              <input 
                name="torque" 
                value={form.torque} 
                onChange={handleChange} 
                placeholder="e.g., 500" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">0-100 km/h (s)</label>
              <input 
                name="acceleration" 
                value={form.acceleration} 
                onChange={handleChange} 
                placeholder="e.g., 4.5" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Top Speed (km/h)</label>
              <input 
                name="topSpeed" 
                value={form.topSpeed} 
                onChange={handleChange} 
                placeholder="e.g., 250" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Fuel Efficiency (L/100km)</label>
              <input 
                name="fuelEfficiency" 
                value={form.fuelEfficiency} 
                onChange={handleChange} 
                placeholder="e.g., 8.5" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <FeatureCheckboxGroup
            title="Safety Features"
            options={featureOptions.safety}
            selected={selectedSafetyFeatures}
            onChange={setSelectedSafetyFeatures}
          />

          <FeatureCheckboxGroup
            title="Luxury Features"
            options={featureOptions.luxury}
            selected={selectedLuxuryFeatures}
            onChange={setSelectedLuxuryFeatures}
          />

          <FeatureCheckboxGroup
            title="Exterior Features"
            options={featureOptions.exterior}
            selected={selectedExteriorFeatures}
            onChange={setSelectedExteriorFeatures}
          />

          <FeatureCheckboxGroup
            title="Interior Features"
            options={featureOptions.interior}
            selected={selectedInteriorFeatures}
            onChange={setSelectedInteriorFeatures}
          />
        </div>

        {/* Technology & Additional Info */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Technology & Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Infotainment System</label>
              <input 
                name="infotainmentSystem" 
                value={form.infotainmentSystem} 
                onChange={handleChange} 
                placeholder="e.g., MBUX, iDrive, MMI" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Premium Sound System</label>
              <input 
                name="soundSystem" 
                value={form.soundSystem} 
                onChange={handleChange} 
                placeholder="e.g., Burmester, Bowers & Wilkins" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Warranty Information</label>
              <input 
                name="warranty" 
                value={form.warranty} 
                onChange={handleChange} 
                placeholder="e.g., 2 years remaining" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Service History</label>
              <input 
                name="serviceHistory" 
                value={form.serviceHistory} 
                onChange={handleChange} 
                placeholder="e.g., Full service history" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Description & Price */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Description & Pricing</h3>
          
          <div className="space-y-1 mb-6">
            <label className="block text-sm font-medium text-gray-700">Vehicle Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Detailed description, features, specifications..." 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]" 
              rows={4} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Number of Doors</label>
              <input 
                name="doors" 
                type="number" 
                min="1" 
                max="6"
                value={form.doors} 
                onChange={handleChange} 
                placeholder="e.g., 4" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Mileage (km)</label>
              <input 
                name="mileageKm" 
                type="number" 
                min="0"
                value={form.mileageKm} 
                onChange={handleChange} 
                placeholder="e.g., 15000" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Price (KES)*</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">KES</span>
                <input 
                  name="priceKes" 
                  type="number" 
                  min="0"
                  value={form.priceKes} 
                  onChange={handleChange} 
                  placeholder="e.g., 4500000" 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Images</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB each)</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 space-y-2">
                {images.map((file, index) => (
                  <div key={index} className="flex items-center gap-4 border-b pb-2">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`upload-preview-${index}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => {
              setForm({
                brand: "",
                model: "",
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
                priceKes: "",
                description: "",
                location: "",
                highBreed: false,
                engineCapacityUnit: "cc",
                trimLevel: "",
                horsepower: "",
                torque: "",
                acceleration: "",
                topSpeed: "",
                driveType: "",
                infotainmentSystem: "",
                soundSystem: "",
                fuelEfficiency: "",
                warranty: "",
                serviceHistory: "",
                safetyFeatures: "",
                luxuryFeatures: "",
                exteriorFeatures: "",
                interiorFeatures: ""
              });
              setSelectedSafetyFeatures([]);
              setSelectedLuxuryFeatures([]);
              setSelectedExteriorFeatures([]);
              setSelectedInteriorFeatures([]);
              setImages([]);
            }} 
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset Form
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "List Premium Vehicle"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
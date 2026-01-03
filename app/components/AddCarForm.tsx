"use client";

import { useState, useEffect } from "react";
import { Car } from "@/app/car";
import { useCurrentUser } from "../Hookes/useCurrentUser";
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}
interface AddCarFormProps {
  onSuccess: () => void;
  carToEdit?: Car | null;
  onCancel: () => void;
}

export default function AddCarForm({ onSuccess, carToEdit, onCancel }: AddCarFormProps) {
  const [user, setUser] = useState<User | null>(null);

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
  ownerType: "",
  features: "",
  customSpecs: "",
  refLink: "",
  seller: user?.email,
  roles: [] as string[],
});
console.log("Initial form Seller:", form.seller, "roles:", form.roles);
const fetchUser = async (): Promise<User | null> => {
  try {
    const res = await fetch("https://api.f-carshipping.com/api/auth/validate", {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("❌ Failed to validate token:", res.statusText);
      return null;
    }

    const data = await res.json();

    const fetchedUser: User = {
      id: Number(data.userId),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      roles: data.roles,
    };

    //  Update both user and form together
    setUser(fetchedUser);
    setForm((prev) => ({
      ...prev,
      Seller: fetchedUser.email,
      roles: fetchedUser.roles,
    }));

    console.log(" User fetched:", fetchedUser.email, fetchedUser.roles);
    return fetchedUser;
  } catch (error) {
    console.error("⚠️ Error validating token:", error);
    return null;
  }
};

//  Run once on mount
useEffect(() => {
  fetchUser();
}, []);

const { user: currentUser } = useCurrentUser();
    const email = currentUser?.email || '';
    const role = currentUser?.roles?.[0] || '';
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customSpecsList, setCustomSpecsList] = useState<{ key: string; value: string }[]>([]);
  const [newCustomSpec, setNewCustomSpec] = useState({ key: "", value: "" });

  const [images, setImages] = useState<File[]>([]); // new files
  const [existingImages, setExistingImages] = useState<string[]>([]); // old image URLs

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (carToEdit) {
      setForm({
        brand: carToEdit.brand || "",
        model: carToEdit.model || "",
        yearOfManufacture: carToEdit.yearOfManufacture || "",
        conditionType: carToEdit.conditionType || "",
        bodyType: carToEdit.bodyType || "",
        color: carToEdit.color || "",
        engineType: carToEdit.engineType || "",
        engineCapacityCc: carToEdit.engineCapacityCc || "",
        fuelType: carToEdit.fuelType || "",
        transmission: carToEdit.transmission || "",
        seats: carToEdit.seats || "",
        doors: carToEdit.doors || "",
        mileageKm: carToEdit.mileageKm || "",
        priceKes: carToEdit.priceKes?.toString() || "",
        description: carToEdit.description || "",
        location: carToEdit.location || "",
        ownerType: carToEdit.ownerType || "",
        features: carToEdit.features || "",
        customSpecs: carToEdit.customSpecs || "",
        refLink: carToEdit.refLink || "",
        seller: carToEdit.Seller || "",
        roles: carToEdit.roles || []
      });

      if (carToEdit.features) {
        setSelectedFeatures(carToEdit.features.split(", ").filter(Boolean));
      }

      if (carToEdit.customSpecs) {
        try {
          const specs = JSON.parse(carToEdit.customSpecs);
          if (Array.isArray(specs)) setCustomSpecsList(specs);
        } catch {
          setCustomSpecsList([{ key: "Additional Info", value: carToEdit.customSpecs }]);
        }
      }

      if (carToEdit.imageUrls) {
        setExistingImages(carToEdit.imageUrls);
      }
    }
  }, [carToEdit]);

  const carBrands = [
    "Toyota","Honda","Ford","Chevrolet","Nissan","Volkswagen","BMW","Mercedes-Benz",
    "Audi","Hyundai","Kia","Mazda","Subaru","Lexus","Volvo","Mitsubishi",
    "Jeep","Land Rover","Porsche","Fiat","Peugeot","Renault","Skoda","Suzuki",
    "Isuzu","Daihatsu","Chrysler","Dodge","Jaguar","Mini","Smart","Tesla","Other"
  ];
  const conditions = ["New", "Used", "Foreign Used", "Certified Pre-Owned"];
  const bodyTypes = [
    "Sedan","SUV","Hatchback","Coupe","Convertible","Wagon","Minivan",
    "Pickup Truck","Crossover","Sports Car","Luxury Car","Commercial Vehicle"
  ];
  const transmissions = ["Automatic", "Manual", "CVT", "Semi-Automatic"];
  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG", "CNG"];
  const colors = [
    "Black","White","Silver","Gray","Blue","Red","Green","Brown",
    "Yellow","Orange","Purple","Gold","Beige","Maroon","Navy Blue","Other"
  ];
  const ownerTypes = ["First Owner","Second Owner","Third Owner","Fourth Owner+","Dealer"];
  const essentialFeatures = [
    "Air Conditioning","Power Steering","Power Windows","Central Locking","Airbags",
    "ABS Brakes","Alloy Wheels","Fog Lights","Rear Parking Sensors","Rear View Camera",
    "Touchscreen Display","Bluetooth","USB Port","Navigation System","Cruise Control",
    "Sunroof/Moonroof","Leather Seats","Heated Seats","Keyless Entry","Push Button Start",
    "Roof Racks","Towing Package","Spare Tire","Service History","Warranty"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const addCustomSpec = () => {
    if (newCustomSpec.key.trim() && newCustomSpec.value.trim()) {
      setCustomSpecsList(prev => [...prev, { ...newCustomSpec }]);
      setNewCustomSpec({ key: "", value: "" });
    }
  };

  const removeCustomSpec = (index: number) => {
    setCustomSpecsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.brand || !form.model || !form.priceKes) {
      setError("Please fill brand, model, and price.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      const carData = {
        ...form,
        priceKes: Number(form.priceKes),
        features: selectedFeatures.join(", "),
        seller: user?.email || form.seller,
          roles: user?.roles[0] || form.roles[0],
        customSpecs: JSON.stringify(customSpecsList),
        imageUrls: existingImages
            };

      formData.append("car", new Blob([JSON.stringify(carData)], { type: "application/json" }));
      images.forEach(file => formData.append("images", file));

      const url = carToEdit
        ? `https://api.f-carshipping.com/api/cars/${carToEdit.id}`
        : "https://api.f-carshipping.com/api/cars";
      const method = carToEdit ? "PUT" : "POST";

      const res = await fetch(
        url, { method, body: formData, 
          credentials: 'include' ,headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(await res.text());

      alert(carToEdit ? "Car updated successfully!" : "Car listed successfully!");
      onSuccess();
       resetForm();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
       resetForm();
    } finally {
      setLoading(false);
       resetForm();
    }
  };

  const resetForm = () => {
    setForm({
      brand: "", model: "", yearOfManufacture: "", conditionType: "",
      bodyType: "", color: "", engineType: "", engineCapacityCc: "",
      fuelType: "", transmission: "", seats: "", doors: "",
      mileageKm: "", priceKes: "", description: "", location: "",
      ownerType: "", features: "", customSpecs: "", seller: user?.email || "", roles: user?.roles || [], refLink: ""
    });
    setSelectedFeatures([]);
    setCustomSpecsList([]);
    setImages([]);
    setExistingImages([]);
  };
console.log("Rendering AddCarForm with user:", user?.email);
  return (
    <div className="p-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">{carToEdit ? "Edit Car" : "Sell Your Car"}</h2>
      <p className="text-center text-gray-600 mb-4">{carToEdit ? "Update your car information" : "Fill in the details to list your car"}</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Brand *</label>
              <select name="brand" value={form.brand} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Select Brand</option>
                {carBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
            <div>
              <label>Model *</label>
              <input name="model" value={form.model} onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Year</label>
              <input type="number" name="yearOfManufacture" value={form.yearOfManufacture} onChange={handleChange} min="1990" max={new Date().getFullYear()+1} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label>Condition</label>
              <select name="conditionType" value={form.conditionType} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Condition</option>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Body Type</label>
              <select name="bodyType" value={form.bodyType} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Body Type</option>
                {bodyTypes.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label>Color</label>
              <select name="color" value={form.color} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Color</option>
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Transmission</label>
              <select name="transmission" value={form.transmission} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Transmission</option>
                {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label>Fuel Type</label>
              <select name="fuelType" value={form.fuelType} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Fuel Type</option>
                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label>Engine Capacity (cc)</label>
              <input name="engineCapacityCc" value={form.engineCapacityCc} onChange={handleChange} className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label>Engine Type</label>
              <input name="engineType" value={form.engineType} onChange={handleChange} className="w-full p-2 border rounded"/>
            </div>
          </div>
        </div>

        {/* Mileage & Pricing */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Mileage & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label>Mileage (km)</label>
              <input type="number" name="mileageKm" value={form.mileageKm} onChange={handleChange} className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label>Price (KES) *</label>
              <input type="number" name="priceKes" value={form.priceKes} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label>Owner Type</label>
              <select name="ownerType" value={form.ownerType} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select Owner Type</option>
                {ownerTypes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label>Doors</label>
              <input type="number" name="doors" value={form.doors} onChange={handleChange} min={1} max={6} className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label>Seats</label>
              <input type="number" name="seats" value={form.seats} onChange={handleChange} min={1} max={9} className="w-full p-2 border rounded"/>
            </div>
          </div>
        </div>

        {/* Car Features */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Car Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {essentialFeatures.map(f => (
              <div key={f} className="flex items-center">
                <input type="checkbox" checked={selectedFeatures.includes(f)} onChange={() => handleFeatureToggle(f)} className="h-4 w-4"/>
                <label className="ml-2">{f}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Specs */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Additional Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
            <input placeholder="Spec Name" value={newCustomSpec.key} onChange={(e)=>setNewCustomSpec(prev=>({...prev,key:e.target.value}))} className="md:col-span-2 p-2 border rounded"/>
            <input placeholder="Value" value={newCustomSpec.value} onChange={(e)=>setNewCustomSpec(prev=>({...prev,value:e.target.value}))} className="md:col-span-2 p-2 border rounded"/>
            <button type="button" onClick={addCustomSpec} className="p-2 bg-gray-200 rounded">Add</button>
          </div>
          {customSpecsList.length>0 && customSpecsList.map((spec,i)=>(
            <div key={i} className="flex justify-between items-center p-2 border-b">
              <span>{spec.key}: {spec.value}</span>
              <button type="button" onClick={()=>removeCustomSpec(i)} className="text-red-500">Remove</button>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Copy reference link here</h3>
          <div className="space-y-4">
            <input name="refLink" value={form.refLink} onChange={handleChange} placeholder="link" className="w-full p-2 border rounded"/>
          </div>
        </div>

       {/* Description & Location */}
<div className="bg-white p-6 rounded-lg border border-gray-200">
  <h3 className="text-lg font-semibold mb-4">Description & Location</h3>
  <div className="space-y-4">
    {/* Description */}
    <textarea
      name="description"
      value={form.description}
      onChange={handleChange}
      placeholder="Car description"
      rows={4}
      className="w-full p-2 border rounded"
    />

    {/* Location Section */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <div className="flex gap-2">
        {/* Dropdown for Local/Import */}
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="p-2 border rounded w-1/3"
        >
          <option value="">Select type</option>
          <option value="Local">Local</option>
          <option value="Import">Import</option>
        </select>

        
      
      </div>
    </div>
  </div>
</div>


        {/* Image Upload */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Car Photos</h3>

          {existingImages.length>0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {existingImages.map((url,i)=><div key={i} className="relative group">
              <img src={url} className="w-full h-24 object-cover rounded"/>
              <button type="button" onClick={()=>setExistingImages(existingImages.filter((_,j)=>j!==i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100">×</button>
            </div>)}
          </div>}

          {images.length>0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {images.map((file,i)=><div key={i} className="relative group">
              <img src={URL.createObjectURL(file)} className="w-full h-24 object-cover rounded"/>
              <button type="button" onClick={()=>setImages(images.filter((_,j)=>j!==i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100">×</button>
            </div>)}
          </div>}

          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Choose Photos
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden"/>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Reset Form</button>
          </div>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            {loading ? "Processing..." : carToEdit ? "Update Car Listing" : "List Car for Sale"}
          </button>
        </div>
      </form>
    </div>
  );
}

export interface CommercialVehicle {
  id: number;
  brand: string;
  model: string;
  type: "Truck" | "Bus" | "Van" | "Camper" | "Pickup" | "Trailer"; // main categories
  yearOfManufacture?: string;
  conditionType?: string; // New, Used, Certified
  bodyType?: string; // Box, Flatbed, Curtain, Minibus, Camper Van, etc.
  color?: string;
  engineType?: string; // Diesel, Petrol, Electric, Hybrid
  engineCapacityCc?: string;
  fuelType?: string;
  transmission?: string;
  mileageKm?: string;
  priceKes?: number;
  location?: string;
  ownerType?: string;
  numberOfAxles?: number;
  payloadCapacityKg?: string; // for trucks
  cargoVolumeM3?: string; // for vans and trucks
  sleeperCapacity?: string; // for trucks/buses with sleeper cabins
  camperFeatures?: string; // e.g., kitchenette, bed, fridge, toilet
  seats?: string; // passenger vehicles
  doors?: string;
  features?: string; // comma separated list
  customSpecs?: string; // JSON string of additional specs
  description?: string;
  imageUrls?: string[]; // Cloudinary URLs
}

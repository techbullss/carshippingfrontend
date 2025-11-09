// types/car.ts
export interface Car {
  id: number;
  brand: string;
  model: string;
  yearOfManufacture: string;
  conditionType: string;
  bodyType: string;
  color: string;
  engineType: string;
  engineCapacityCc: string;
  fuelType: string;
  transmission: string;
  seats: string;
  doors: string;
  mileageKm: string;
  priceKes: string;
  description: string;
  location: string;
  ownerType: string;
  features: string;      // comma-separated string
  customSpecs: string;   // JSON string
  images?: string[];     // optional for image URLs
  imageUrls: string[];   // always present
  seller?: string;       // optional
  highBreed?: boolean;   // optional
  Seller: string;        // optional
  roles: string[];       // optional
  refLink: string; 
  refNo: string;  
  status?: string;       // optional
}

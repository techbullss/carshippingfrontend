"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Car, 
  Truck, 
  Bike, 
  Users, 
  BarChart3, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  Package
} from "lucide-react";
import { useCurrentUser } from "../Hookes/useCurrentUser";

interface DashboardStats {
  totalCars: number;
  totalCommercialVehicles: number;
  totalMotorcycles: number;
  totalUsers: number;
  recentCars: any[];
  recentCommercialVehicles: any[];
  recentMotorcycles: any[];
}

export default function DashboardHome() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalCommercialVehicles: 0,
    totalMotorcycles: 0,
    totalUsers: 0,
    recentCars: [],
    recentCommercialVehicles: [],
    recentMotorcycles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const { user } = useCurrentUser();
    const email = user?.email || '';
    const role = user?.roles?.[0] || '';
  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [carsRes, commercialRes, motorcyclesRes, usersRes] = await Promise.all([
       fetch(`https://api.f-carshipping.com/api/cars/dashboard?`, {
      method: 'POST', // change to POST to send JSON body
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role }), // send user info
    }),
        fetch(`https://api.f-carshipping.com/api/vehicles/dashboard?`, {
      method: 'POST', // change to POST to send JSON body
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role }),
        }),
        fetch('https://api.f-carshipping.com/api/motorcycles?page=0&size=5', {
          credentials: 'include'
        }),
        fetch('https://api.f-carshipping.com/api/admin/users', {
          credentials: 'include'
        })
      ]);

      const carsData = carsRes.ok ? await carsRes.json() : { content: [], totalElements: 0 };
      const commercialData = commercialRes.ok ? await commercialRes.json() : { content: [], totalElements: 0 };
      const motorcyclesData = motorcyclesRes.ok ? await motorcyclesRes.json() : { content: [], totalElements: 0 };
      const usersData = usersRes.ok ? await usersRes.json() : [];

      setStats({
        totalCars: carsData.totalElements || 0,
        totalCommercialVehicles: commercialData.totalElements || 0,
        totalMotorcycles: motorcyclesData.totalElements || 0,
        totalUsers: usersData.length || 0,
        recentCars: carsData.content || [],
        recentCommercialVehicles: commercialData.content || [],
        recentMotorcycles: motorcyclesData.content || []
      });

    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    onClick 
  }: { 
    title: string;
    value: number;
    icon: any;
    color: string;
    onClick: () => void;
  }) => (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer ${color}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-blue-50">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const RecentItemCard = ({ 
    item, 
    type 
  }: { 
    item: any; 
    type: 'car' | 'commercial' | 'motorcycle';
  }) => {
    const getTitle = () => {
      switch (type) {
        case 'car': return `${item.brand} ${item.model}`;
        case 'commercial': return `${item.brand} ${item.model}`;
        case 'motorcycle': return `${item.brand} ${item.model}`;
        default: return '';
      }
    };

    const getSubtitle = () => {
      switch (type) {
        case 'car': return `KES ${item.priceKes?.toLocaleString()}`;
        case 'commercial': return `KES ${item.priceKes?.toLocaleString()}`;
        case 'motorcycle': return `KES ${item.price?.toLocaleString()}`;
        default: return '';
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <img
          src={item.imageUrls?.[0] || "/placeholder-vehicle.jpg"}
          alt={getTitle()}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {getTitle()}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {getSubtitle()}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-2">
          
          <p className="text-gray-600 mt-2">
            Welcome to your vehicle management dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

  {/* Cars */}
  <div
    onClick={() => router.push('/dashboard/Cars')}
    className="cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Car className="w-5 h-5 text-gray-600" />
      <p className="text-sm text-gray-500">Total Cars</p>
    </div>
    <h2 className="text-3xl font-semibold mt-2">
      {stats.totalCars}
    </h2>
  </div>

  {/* Commercial Vehicles */}
  <div
    onClick={() => router.push('/dashboard/HeavyCommercialVehicle')}
    className="cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Truck className="w-5 h-5 text-gray-600" />
      <p className="text-sm text-gray-500">Commercial Vehicles</p>
    </div>
    <h2 className="text-3xl font-semibold mt-2">
      {stats.totalCommercialVehicles}
    </h2>
  </div>

  {/* Motorcycles */}
  <div
    onClick={() => router.push('/dashboard/Motocycle')}
    className="cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Bike className="w-5 h-5 text-gray-600" />
      <p className="text-sm text-gray-500">Motorcycles</p>
    </div>
    <h2 className="text-3xl font-semibold mt-2">
      {stats.totalMotorcycles}
    </h2>
  </div>

  {/* Users */}
  <div
    onClick={() => router.push('/dashboard/Users')}
    className="cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Users className="w-5 h-5 text-gray-600" />
      <p className="text-sm text-gray-500">Total Users</p>
    </div>
    <h2 className="text-3xl font-semibold mt-2">
      {stats.totalUsers}
    </h2>
  </div>

</div>

        {/* Recent Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Cars */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Car className="w-5 h-5 mr-2 text-blue-600" />
                Recent Cars
              </h3>
              <button 
                onClick={() => router.push('/dashboard/Cars')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {stats.recentCars.length > 0 ? (
                stats.recentCars.map((car) => (
                  <RecentItemCard key={car.id} item={car} type="car" />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No cars found</p>
              )}
            </div>
          </div>

          {/* Recent Commercial Vehicles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-green-600" />
                Recent Commercial Vehicles
              </h3>
              <button 
                onClick={() => router.push('/dashboard/HeavyCommercialVehicle')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {stats.recentCommercialVehicles.length > 0 ? (
                stats.recentCommercialVehicles.map((vehicle) => (
                  <RecentItemCard key={vehicle.id} item={vehicle} type="commercial" />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No commercial vehicles found</p>
              )}
            </div>
          </div>

          {/* Recent Motorcycles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bike className="w-5 h-5 mr-2 text-purple-600" />
                Recent Motorcycles
              </h3>
              <button 
                onClick={() => router.push('/dashboard/Motocycle')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {stats.recentMotorcycles.length > 0 ? (
                stats.recentMotorcycles.map((motorcycle) => (
                  <RecentItemCard key={motorcycle.id} item={motorcycle} type="motorcycle" />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No motorcycles found</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/cars?add=new')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Add New Car</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/HeavyCommercialVehicle?add=new')}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center"
            >
              <Truck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Commercial Vehicle</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/Motocycle?add=new')}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center"
            >
              <Bike className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Motorcycle</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/Users')}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-center"
            >
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
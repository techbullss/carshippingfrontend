"use client";
import React, { useState } from 'react';
import Head from 'next/head';

const MotorcyclesPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    type: '',
    priceRange: '',
    year: ''
  });

  // Sample motorcycle data
  const [motorcycles, setMotorcycles] = useState([
    {
      id: 1,
      make: 'Triumph',
      model: 'Tiger 900',
      year: 2022,
      type: 'Adventure',
      engineSize: '900cc',
      price: 850000,
      mileage: 3200,
      image: '/motorcycle1.jpg',
      location: 'London, UK'
    },
    {
      id: 2,
      make: 'BMW',
      model: 'R1250GS',
      year: 2021,
      type: 'Adventure',
      engineSize: '1254cc',
      price: 1200000,
      mileage: 5800,
      image: '/motorcycle2.jpg',
      location: 'Manchester, UK'
    },
    {
      id: 3,
      make: 'Royal Enfield',
      model: 'Interceptor 650',
      year: 2023,
      type: 'Classic',
      engineSize: '648cc',
      price: 550000,
      mileage: 1200,
      image: '/motorcycle3.jpg',
      location: 'Birmingham, UK'
    }
  ]);

  const [newMotorcycle, setNewMotorcycle] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: '',
    engineSize: '',
    price: '',
    mileage: '',
    location: '',
    image: null
  });

  const motorcycleTypes = ['Adventure', 'Sport', 'Cruiser', 'Naked', 'Classic', 'Scooter', 'Touring', 'Off-Road'];
  const motorcycleMakes = ['Triumph', 'BMW', 'Royal Enfield', 'Ducati', 'Kawasaki', 'Yamaha', 'Honda', 'Suzuki', 'KTM'];

  const filteredMotorcycles = motorcycles.filter(bike => {
    return (
      (filters.make === '' || bike.make === filters.make) &&
      (filters.type === '' || bike.type === filters.type) &&
      (filters.priceRange === '' || (
        filters.priceRange === 'low' && bike.price < 600000 ||
        filters.priceRange === 'medium' && bike.price >= 600000 && bike.price < 1000000 ||
        filters.priceRange === 'high' && bike.price >= 1000000
      )) &&
      (filters.year === '' || bike.year.toString() === filters.year)
    );
  });

  const handleAddMotorcycle = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const newId = Math.max(...motorcycles.map(bike => bike.id)) + 1;
    setMotorcycles([...motorcycles, { 
      id: newId, 
      ...newMotorcycle, 
      price: Number(newMotorcycle.price),
      mileage: Number(newMotorcycle.mileage),
      image: newMotorcycle.image || '/placeholder.jpg'
    }]);
    setNewMotorcycle({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: '',
      engineSize: '',
      price: '',
      mileage: '',
      location: '',
      image: null
    });
    setIsAddModalOpen(false);
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewMotorcycle({ ...newMotorcycle, [name]: value });
  };

  return (
    <>
      <Head>
        <title>UK Motorcycles for Export to Kenya | Motorcycle Inventory</title>
        <meta name="description" content="Browse our selection of quality UK motorcycles available for export to Kenya. Adventure, sport, cruiser, and classic models." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Motorcycle Inventory</h1>
            <p className="text-gray-600 mt-2">Quality UK motorcycles available for export to Kenya</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 md:mt-0 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Motorcycle
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Motorcycles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.make}
                onChange={(e) => setFilters({...filters, make: e.target.value})}
              >
                <option value="">All Makes</option>
                {motorcycleMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                {motorcycleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              >
                <option value="">All Prices</option>
                <option value="low">Under KES 600,000</option>
                <option value="medium">KES 600,000 - 1,000,000</option>
                <option value="high">Over KES 1,000,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
              >
                <option value="">All Years</option>
                {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMotorcycles.length} of {motorcycles.length} motorcycles
          </p>
        </div>

        {/* Motorcycles Grid */}
        {filteredMotorcycles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotorcycles.map(bike => (
              <div key={bike.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for bike image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bike.make} {bike.model}</h3>
                      <p className="text-gray-600">{bike.year} • {bike.engineSize}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {bike.type}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">KES {bike.price.toLocaleString()}</p>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{bike.mileage.toLocaleString()} km</span>
                      <span>{bike.location}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No motorcycles found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}

        {/* Add Motorcycle Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Motorcycle</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddMotorcycle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <select
                    name="make"
                    value={newMotorcycle.make}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Make</option>
                    {motorcycleMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={newMotorcycle.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    name="year"
                    value={newMotorcycle.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Array.from({length: 20}, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={newMotorcycle.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {motorcycleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                    <input
                      type="text"
                      name="engineSize"
                      value={newMotorcycle.engineSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      name="mileage"
                      value={newMotorcycle.mileage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                    <input
                      type="number"
                      name="price"
                      value={newMotorcycle.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newMotorcycle.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="e.g., London, UK"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={newMotorcycle.image || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                  >
                    Add Motorcycle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MotorcyclesPage;
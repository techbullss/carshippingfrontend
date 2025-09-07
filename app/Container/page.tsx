"use client";
import React, { useState } from 'react';
import Head from 'next/head';

const ContainersPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    size: '',
    type: '',
    condition: '',
    priceRange: ''
  });

  // Sample container data
  const [containers, setContainers] = useState([
    {
      id: 1,
      size: '20ft',
      type: 'Standard',
      condition: 'Used',
      price: 250000,
      location: 'Southampton, UK',
      available: true,
      image: '/container1.jpg',
      features: ['Wind/Watertight', 'Double Doors']
    },
    {
      id: 2,
      size: '40ft',
      type: 'High Cube',
      condition: 'One-Trip',
      price: 480000,
      location: 'Felixstowe, UK',
      available: true,
      image: '/container2.jpg',
      features: ['Extra Height', 'Like New']
    },
    {
      id: 3,
      size: '20ft',
      type: 'Refrigerated',
      condition: 'Used',
      price: 750000,
      location: 'London, UK',
      available: false,
      image: '/container3.jpg',
      features: ['Refrigeration Unit', 'Insulated']
    }
  ]);

  const [newContainer, setNewContainer] = useState<{
    size: string;
    type: string;
    condition: string;
    price: string;
    location: string;
    available: boolean;
    features: string[];
    image: string;
  }>({
    size: '',
    type: '',
    condition: '',
    price: '',
    location: '',
    available: true,
    features: [],
    image: '/placeholder.jpg'
  });

  const containerSizes = ['20ft', '40ft'];
  const containerTypes = ['Standard', 'High Cube', 'Refrigerated', 'Open Top', 'Flat Rack', 'Tank'];
  const containerConditions = ['New', 'One-Trip', 'Used', 'Cargo Worthy', 'Wind/Watertight'];

  const filteredContainers = containers.filter(container => {
    return (
      (filters.size === '' || container.size === filters.size) &&
      (filters.type === '' || container.type === filters.type) &&
      (filters.condition === '' || container.condition === filters.condition) &&
      (filters.priceRange === '' || (
        filters.priceRange === 'low' && container.price < 300000 ||
        filters.priceRange === 'medium' && container.price >= 300000 && container.price < 600000 ||
        filters.priceRange === 'high' && container.price >= 600000
      ))
    );
  });

  const handleAddContainer = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const newId = Math.max(...containers.map(container => container.id)) + 1;
    setContainers([...containers, { id: newId, ...newContainer, price: Number(newContainer.price) }]);
    setNewContainer({
      size: '',
      type: '',
      condition: '',
      price: '',
      location: '',
      available: true,
      features: [],
      image: '/placeholder.jpg'
    });
    setIsAddModalOpen(false);
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewContainer({ ...newContainer, [name]: value });
  };

  return (
    <>
      <Head>
        <title>Shipping Containers for Export to Kenya | Container Inventory</title>
        <meta name="description" content="Browse our selection of quality shipping containers available for export from UK to Kenya. 20ft and 40ft containers in various types." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Container Inventory</h1>
            <p className="text-gray-600 mt-2">Quality shipping containers available for export to Kenya</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 md:mt-0 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Container
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Containers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.size}
                onChange={(e) => setFilters({...filters, size: e.target.value})}
              >
                <option value="">All Sizes</option>
                {containerSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
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
                {containerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.condition}
                onChange={(e) => setFilters({...filters, condition: e.target.value})}
              >
                <option value="">All Conditions</option>
                {containerConditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
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
                <option value="low">Under KES 300,000</option>
                <option value="medium">KES 300,000 - 600,000</option>
                <option value="high">Over KES 600,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredContainers.length} of {containers.length} containers
          </p>
        </div>

        {/* Containers Grid */}
        {filteredContainers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContainers.map(container => (
              <div key={container.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for container image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-9 0H5m2 0h2m2 0h2m2 0h2m2 0h2"></path>
                    </svg>
                  </div>
                  {!container.available && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      SOLD
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{container.size} {container.type} Container</h3>
                      <p className="text-gray-600 capitalize">{container.condition}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${container.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {container.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">KES {container.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">{container.location}</p>
                    
                    {container.features && container.features.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {container.features.map((feature, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    className={`w-full mt-4 py-2 px-4 rounded-md transition-colors ${container.available ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    disabled={!container.available}
                  >
                    {container.available ? 'View Details' : 'Not Available'}
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No containers found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}

        {/* Add Container Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Container</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddContainer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    name="size"
                    value={newContainer.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Size</option>
                    {containerSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={newContainer.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {containerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    name="condition"
                    value={newContainer.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Condition</option>
                    {containerConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                    <input
                      type="number"
                      name="price"
                      value={newContainer.price}
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
                      value={newContainer.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="e.g., Southampton, UK"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <select
                    name="available"
                    value={String(newContainer.available)}
                    onChange={(e) => setNewContainer({...newContainer, available: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    name="features"
                    onChange={(e) => setNewContainer({...newContainer, features: e.target.value.split(',')})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Wind/Watertight, Double Doors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
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
                    Add Container
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

export default ContainersPage;
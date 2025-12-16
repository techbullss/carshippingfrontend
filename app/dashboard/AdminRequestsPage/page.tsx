"use client";

import { useState } from "react";
import { 
  Search, Filter, Package, Clock, 
  CheckCircle, XCircle, Eye, MessageSquare,
  Download, MoreVertical, User, MapPin,
  DollarSign, Calendar
} from "lucide-react";

// Mock data for requests
const mockRequests = [
  {
    id: "REQ-001",
    client: "John Doe",
    item: "iPhone 15 Pro",
    origin: "USA",
    destination: "Nairobi, Kenya",
    budget: 1200,
    status: "pending",
    date: "2024-01-15",
    urgency: "normal",
    notes: "Looking for 256GB model",
  },
  // Add more mock data as needed
];

export default function AdminRequestsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Client Requests</h1>
        <p className="text-gray-600">Manage and track all item sourcing requests</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  filter === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Package className="text-blue-500" size={32} />
          </div>
        </div>
        {/* Add more stat cards */}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client & Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.id}</div>
                    <div className="text-sm text-gray-500">{request.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-8 h-8 rounded-full bg-gray-100 p-1 mr-3" />
                      <div>
                        <div className="font-medium">{request.client}</div>
                        <div className="text-sm text-gray-600">{request.item}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      <MapPin size={14} className="mr-1" />
                      {request.origin} → {request.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      <DollarSign size={14} className="mr-1" />
                      ${request.budget}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
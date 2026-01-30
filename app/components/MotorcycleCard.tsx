"use client";
import React from "react";
import { Edit, Trash2, Eye, CheckCircle, XCircle, Shield } from "lucide-react";

interface MotorcycleCardProps {
  m: any;
  onEdit?: (m: any) => void;
  onDelete?: (m: any) => void;
  onDetails: (m: any) => void;
  onApprove?: (m: any) => void;
  onReject?: (m: any) => void;
  showAdminControls?: boolean;
}

export default function MotorcycleCard({
  m,
  onEdit,
  onDelete,
  onDetails,
  onApprove,
  onReject,
  showAdminControls = false,
}: MotorcycleCardProps) {
  // Format price with commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };
    
    const defaultStyle = "bg-gray-100 text-gray-800 border-gray-200";
    const style = statusStyles[status as keyof typeof statusStyles] || defaultStyle;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${style}`}>
        {status}
      </span>
    );
  };

  // Check if card is editable (owner or admin)
  const isEditable = onEdit !== undefined;
  const isDeletable = onDelete !== undefined;
  const showAdminActions = showAdminControls && m.status === "PENDING";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {m.imageUrls && m.imageUrls.length > 0 ? (
          <img
            src={m.imageUrls[0]}
            alt={`${m.brand} ${m.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
          {getStatusBadge(m.status)}
        </div>
        
        {/* Quick Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onDetails(m)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
          
          {isEditable && (
            <button
              onClick={() => onEdit(m)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all"
              title="Edit"
            >
              <Edit className="w-4 h-4 text-gray-700 group-hover:text-blue-600" />
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
              {m.brand} {m.model}
            </h3>
            <p className="text-gray-500 text-sm">{m.type || "Motorcycle"}</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-blue-600">
              {formatPrice(m.price)}
            </div>
            <div className="text-xs text-gray-500">{m.year}</div>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="text-gray-600">
            <span className="font-medium">Engine:</span> {m.engineCapacity || "—"} cc
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Location:</span> {m.location || "—"}
          </div>
          {m.owner && (
            <div className="text-gray-600 col-span-2">
              <span className="font-medium">Owner:</span>{" "}
              <span className="text-gray-700">{m.owner.split('@')[0]}</span>
            </div>
          )}
        </div>

        {/* Features Tags */}
        {m.features && m.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {m.features.slice(0, 3).map((feature: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
              {m.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{m.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          {/* Admin Actions */}
          {showAdminActions && (
            <div className="flex gap-2">
              {onApprove && (
                <button
                  onClick={() => onApprove(m)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors"
                  title="Approve Listing"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => onReject(m)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                  title="Reject Listing"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              )}
            </div>
          )}

          {/* Regular Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onDetails(m)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Details
            </button>

            {isDeletable && (
              <button
                onClick={() => onDelete(m)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Admin Indicator */}
        {showAdminControls && !showAdminActions && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Admin View • ID: {m.id}</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator Bar */}
      <div className={`h-1 ${
        m.status === "APPROVED" ? "bg-green-500" :
        m.status === "PENDING" ? "bg-yellow-500" :
        "bg-red-500"
      }`} />
    </div>
  );
}
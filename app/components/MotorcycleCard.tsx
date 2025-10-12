"use client";
import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";

export default function MotorcycleCard({
  m,
  onEdit,
  onDelete,
  onDetails,
}: {
  m: any;
  onEdit: (m: any) => void;
  onDelete: (m: any) => void;
  onDetails: (m: any) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      {m.imageUrls && m.imageUrls.length > 0 ? (
        <img
          src={m.imageUrls[0]}
          alt={`${m.brand} ${m.model}`}
          className="h-56 w-full object-cover"
        />
      ) : (
        <div className="h-56 flex items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {m.brand} {m.model}
            </h3>
            <p className="text-sm text-gray-500">{m.type} • {m.engineCapacity} cc</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Status</div>
            <div className={`mt-1 text-sm font-semibold ${m.status === "Available" ? "text-green-600" : "text-red-600"}`}>
              {m.status}
            </div>
          </div>
        </div>

        <div className="mt-4 flex-1">
          <p className="text-base font-bold text-blue-600">KES {m.price?.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">{m.location || "—"}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onDetails(m)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Details"
          >
            <Eye className="w-4 h-4" /> Details
          </button>
          <button
            onClick={() => onEdit(m)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-yellow-400 text-white hover:bg-yellow-500 transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(m)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

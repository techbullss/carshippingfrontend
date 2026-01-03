"use client";

import { useState } from "react";

interface RejectModalProps {
  vehicleId: number | null;
  show: boolean;
  onClose: () => void;
  onReject: (vehicleId: number, reason: string) => void;
}

export default function Reject_Modal({ 
  vehicleId, 
  show, 
  onClose, 
  onReject 
}: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!show || !vehicleId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    
    setSubmitting(true);
    try {
      await onReject(vehicleId, reason);
      setReason("");
    } catch (error) {
      console.error("Rejection failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">Reject Vehicle</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Please provide a reason for rejection:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Incomplete information, price too high, photos unclear..."
              className="w-full border rounded p-3 min-h-[120px]"
              required
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={submitting || !reason.trim()}
            >
              {submitting ? "Rejecting..." : "Confirm Reject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
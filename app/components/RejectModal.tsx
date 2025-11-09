import { useState } from "react";

interface RejectModalProps {
  carId: number | null;
  show: boolean;
  onClose: () => void;
  onReject: (carId: number, reason: string) => void;
}

const RejectModal = ({ carId, show, onClose, onReject }: RejectModalProps) => {
  const [reason, setReason] = useState("");

  if (!show || carId === null) return null;

  const handleSubmit = () => {
    onReject(carId, reason);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Reject Car Listing</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for rejection"
          className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none"
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;

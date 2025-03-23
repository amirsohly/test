"use client";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Are you sure you want to delete this item?</h3>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
          >
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
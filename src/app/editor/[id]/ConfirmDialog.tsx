import { useState, useEffect } from "react";

export interface ConfirmDialogProps {
  message: string;
  isDangerous?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  message,
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Reset visibility when message changes
  useEffect(() => {
    setIsVisible(true);
  }, [message]);

  useEffect(() => {
    if (!isDangerous) {
      // Auto-dismiss non-dangerous notifications after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        handleCancel?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isDangerous, message]);

  if (!isVisible) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm?.();
    setIsVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <p className="text-sm text-gray-800 mb-4 text-right">{message}</p>

      {isDangerous && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}

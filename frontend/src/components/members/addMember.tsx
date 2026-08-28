import { Button } from "../ui/button";
import { X } from "lucide-react";

export const AddMember = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    document.body.style.overflow = "";
  };

  return (
    <div
      onClick={handleClose}
      className="p-8 fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-100 "
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-100"
        >
          <div className="flex justify-between ">
            <h3 className="font-bold text-lg mb-4">User Profile</h3>
            <X cursor={"pointer"} onClick={handleClose} />
          </div>
          <input
            type="text"
            placeholder="Enter workspace name..."
            className="w-full border p-2 rounded-lg mb-4 outline-none"
          />
          <textarea
            placeholder="Enter workspace description..."
            className="w-full border p-2 rounded-lg mb-4 outline-none"
          />
          <Button
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-medium"
          >
            Create Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};

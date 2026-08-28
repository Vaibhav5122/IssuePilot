"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { usePostCreateWorkspace } from "@/lib/hooks/useWorkspace/useGetWorkspace";

export const CreateWorkspace = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;

  const [create, setCreate] = useState({ name: "", description: "" });

  const handleClose = () => {
    onClose();
    document.body.style.overflow = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setCreate({ ...create, [e.target.name]: e.target.value });
  };

  const { mutate: createWorkspace, isPending: Loading } =
    usePostCreateWorkspace();

  const handleSubmit = () => {
    createWorkspace(create, {
      onSuccess: (data) => {
        console.log("Workspace created successfully", data);
        handleClose();
      },
      onError: (error) => {
        console.error("Failed to create workspace:", error);
      },
    });
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg mb-4">User Profile</h3>
          <X cursor={"pointer"} onClick={handleClose} />
        </div>
        <input
          name="name"
          onChange={handleChange}
          defaultValue={create.name}
          type="text"
          placeholder="Enter workspace name..."
          className="w-full border p-2 rounded-lg mb-4 outline-none"
        />
        <textarea
          name="description"
          defaultValue={create.description}
          placeholder="Enter workspace description..."
          className="w-full border p-2 rounded-lg mb-4 outline-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={Loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-medium"
        >
          {Loading ? "creating..." : "Create Workspace"}
        </Button>
      </div>
    </div>
  );
};

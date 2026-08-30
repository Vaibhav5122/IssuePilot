"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { usePostCreateMembers } from "@/lib/hooks/useMembers/useMembers";
import { useParams } from "next/navigation";

export const AddMember = ({ memberId, isOpen, onClose }: any) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState({ email: "" });

  const handleClose = () => {
    onClose();
    document.body.style.overflow = "";
  };

  const { mutate: createWorkspace, isPending: Loading } =
    usePostCreateMembers(memberId);

  const handleSubmit = () => {
    createWorkspace(email, {
      onSuccess: (data) => {
        console.log("User added successfully", data);
        handleClose();
      },
      onError: (error) => {
        console.error("Failed to add user in workspace:", error);
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
          name="email"
          onChange={(e) =>
            setEmail({ ...email, [e.target.name]: e.target.value })
          }
          defaultValue={email.email}
          type="email"
          placeholder="Enter user email to add..."
          className="w-full border p-2 rounded-lg mb-4 outline-none"
        />

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-medium"
        >
          {Loading ? "Adding..." : "Add Members"}
        </Button>
      </div>
    </div>
  );
};

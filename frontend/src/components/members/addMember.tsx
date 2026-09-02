"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Mail, Shield } from "lucide-react";
import { useAddWorkspaceMember } from "@/lib/hooks/useMembers";
import { Input } from "@/components/ui/input";

interface AddMemberProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddMember = ({ workspaceId, isOpen, onClose }: AddMemberProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  const addMemberMutation = useAddWorkspaceMember(workspaceId);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    addMemberMutation.mutate(
      { userEmail: email.trim(), role },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">Invite Team Member</h3>
            <p className="text-xs text-muted-foreground">Add a member to your workspace by email.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-lg">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              Member Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              Role Permission
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("MEMBER")}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  role === "MEMBER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setRole("ADMIN")}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  role === "ADMIN"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
              >
                <Shield size={14} /> Admin
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addMemberMutation.isPending}
              className="rounded-xl bg-primary text-primary-foreground font-medium"
            >
              {addMemberMutation.isPending ? "Inviting..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

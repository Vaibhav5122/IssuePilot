"use client";

import { Button } from "@/components/ui/button";
import { CreateWorkspace } from "@/components/workspace/createWorkspace";
import { useGetWorkspace } from "@/lib/hooks/useWorkspace/useGetWorkspace";
import { FolderIcon, PlusIcon, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WorkspacesPage() {
  const { data: workspaces, isPending } = useGetWorkspace();

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <div className="flex-1 p-4 md:p-8 lg:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Workspaces
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Manage your workspaces and team access.
            </p>
          </div>
          <Button
            onClick={toggleModal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <PlusIcon size={18} /> New Workspace
          </Button>
          <CreateWorkspace isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>

        {isPending ? (
          <div className="text-sm text-gray-500">Loading workspaces...</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workspaces && workspaces.length > 0 ? (
              workspaces.map((item: any) => (
                <div
                  key={item.workspace.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                      <FolderIcon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.workspace.name}
                      </h3>
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-xs">
                    <Link
                      href={`/workspaces/${item.workspace.id}/members`}
                      className="flex items-center gap-1.5 text-indigo-600 hover:underline font-medium"
                    >
                      <Users size={14} /> View Members
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">
                No workspaces found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

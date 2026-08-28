"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/lib/hooks/useWorkspace/useGetWorkspace";
import {
  ChevronRight,
  CircleCheck,
  CircleDotIcon,
  FolderIcon,
  MoreHorizontal,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";

const WorkspacePage = () => {
  const { data: workspaces, isPending, error } = useGetWorkspace();
  console.log("shaa", workspaces);

  return (
    <main className="flex-1 p-4 md:p-8 lg:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* {workspaces && workspaces.length < 1 ? (
                <Button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <PlusIcon size={18} /> New project
                </Button>
              ) : (
                <div>je</div>
              )} */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  {workspaces && workspaces.length > 1
                    ? workspaces.name
                    : "IssuePilot Workspace"}
                </h1>
              </div>
              <Button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                <PlusIcon size={18} /> New project
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                <div className="rounded-xl bg-blue-50 p-3.5">
                  <FolderIcon className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Active projects
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">12</h2>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                <div className="rounded-xl bg-purple-50 p-3.5">
                  <CircleDotIcon className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Open issues
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">84</h2>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs sm:col-span-2 lg:col-span-1">
                <div className="rounded-xl bg-green-50 p-3.5">
                  <CircleCheck className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Completed issues
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">320</h2>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                        <ShoppingCartIcon size={20} />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-900">
                        E-commerce Platform
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        Modernizing the shopping experience and checkout flow.
                      </p>
                    </div>

                    <div className="mt-4">
                      <span className="inline-flex rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                        In progress
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-indigo-600">
                        24{" "}
                        <span className="font-normal text-gray-500">open</span>
                      </span>
                      <span className="font-semibold text-green-600">
                        98{" "}
                        <span className="font-normal text-gray-500">done</span>
                      </span>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                      U
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-gray-200 bg-white px-8 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                View all projects <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </main>
  );
};

export default WorkspacePage;

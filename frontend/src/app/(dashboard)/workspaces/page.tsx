// import Sidebar from "@/components/dashboard/Sidebar";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   ChevronRight,
//   CircleCheck,
//   CircleDotIcon,
//   FolderIcon,
//   PlusIcon,
//   ShoppingCartIcon,
// } from "lucide-react";
// import Image from "next/image";
// import React from "react";

// const page = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="mt-20 flex items-center justify-center flex-col gap-10">
//         <div className="flex items-center justify-between lg:w-6/12">
//           <h1>Issuepilot Workspace</h1>
//           <Button>
//             {" "}
//             <PlusIcon /> New Project
//           </Button>
//         </div>
//         <div className="flex gap-30 border-gray-200 border p-7 py-10 rounded-xl">
//           <div className="flex items-center justify-center gap-4">
//             <div className="bg-blue-100 p-4 rounded-xl">
//               <FolderIcon className="text-blue-500" size={30} />
//             </div>
//             <div>
//               <p>Active Projects</p>
//               <h1 className="font-bold text-2xl">12</h1>
//             </div>
//           </div>
//           <div className="flex items-center justify-center gap-4">
//             <div className="bg-violet-100 p-4 rounded-xl">
//               <CircleDotIcon className="text-violet-700" size={30} />
//             </div>
//             <div>
//               <p>Open Issues</p>
//               <h1 className="font-bold text-2xl">84</h1>
//             </div>
//           </div>
//           <div className="flex items-center justify-center gap-4">
//             <div className="bg-green-100 p-4 rounded-xl">
//               <CircleCheck className="text-green-600" size={30} />
//             </div>
//             <div>
//               <p>Completed Issues </p>
//               <h1 className="font-bold text-2xl">320</h1>
//             </div>
//           </div>
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold mb-7">Projects</h1>
//           <div className="flex max-w-210 flex-wrap sm:items-center items-start gap-9">
//             <div className="max-w-70 flex flex-col gap-4 border-gray-200 hover:shadow-xl border p-6 rounded-xl">
//               <div className="flex justify-between items-center ">
//                 <div className="bg-violet-800 p-2 rounded-xl ">
//                   <ShoppingCartIcon className="" color="white" />{" "}
//                 </div>
//                 <p className="text-2xl font-bold">...</p>
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg">E-Commerce Platform</h3>
//                 <p>Modernizing the shopping experience and checkout flow.</p>
//                 <Button
//                   variant={"destructive"}
//                   className={
//                     "bg-purple-100 mt-4 text-purple-700 hover:bg-purple-200"
//                   }
//                 >
//                   In progress
//                 </Button>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex gap-4">
//                   <div className="text-purple-700 flex gap-1">
//                     <p className="font-bold">24</p> Open
//                   </div>
//                   <div className="text-green-700 flex gap-1">
//                     <p className="font-bold">98</p> Done
//                   </div>
//                 </div>
//                 <div className="">
//                   {" "}
//                   <Image
//                     color="inverse"
//                     className="invert-100 border border-gray-400 rounded-full"
//                     src={"/vercel.svg"}
//                     alt="image"
//                     width={0}
//                     height={30}
//                   />{" "}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Button
//           variant={"secondary"}
//           className="border rounded-xl border-gray-300 py-1.5 px-20 flex gap-4 items-center justify-center cursor-pointer"
//         >
//           View All Projects <ChevronRight className="" size={"20"} />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default page;
"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  CircleCheck,
  CircleDotIcon,
  FolderIcon,
  Menu,
  MoreHorizontal,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import React, { useState } from "react";

const WorkspacePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#f9fafb]">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <Sidebar isOpen={sidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-gray-800">IssuePilot</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  Acme Workspace
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
      </div>
    </div>
  );
};

export default WorkspacePage;

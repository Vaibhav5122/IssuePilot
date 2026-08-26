import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronRight,
  CircleCheck,
  CircleDotIcon,
  FolderIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="mt-20 flex items-center justify-center flex-col gap-10">
      <div className="flex items-center justify-between lg:w-6/12">
        <h1>Issuepilot Workspace</h1>
        <Button>
          {" "}
          <PlusIcon /> New Project
        </Button>
      </div>
      <div className="flex gap-30 border-gray-200 border p-7 py-10 rounded-xl">
        <div className="flex items-center justify-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <FolderIcon className="text-blue-500" size={30} />
          </div>
          <div>
            <p>Active Projects</p>
            <h1 className="font-bold text-2xl">12</h1>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-violet-100 p-4 rounded-xl">
            <CircleDotIcon className="text-violet-700" size={30} />
          </div>
          <div>
            <p>Open Issues</p>
            <h1 className="font-bold text-2xl">84</h1>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl">
            <CircleCheck className="text-green-600" size={30} />
          </div>
          <div>
            <p>Completed Issues </p>
            <h1 className="font-bold text-2xl">320</h1>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-7">Projects</h1>
        <div className="flex max-w-210 flex-wrap sm:items-center items-start gap-9">
          <div className="max-w-70 flex flex-col gap-4 border-gray-200 hover:shadow-xl border p-6 rounded-xl">
            <div className="flex justify-between items-center ">
              <div className="bg-violet-800 p-2 rounded-xl ">
                <ShoppingCartIcon className="" color="white" />{" "}
              </div>
              <p className="text-2xl font-bold">...</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">E-Commerce Platform</h3>
              <p>Modernizing the shopping experience and checkout flow.</p>
              <Button
                variant={"destructive"}
                className={
                  "bg-purple-100 mt-4 text-purple-700 hover:bg-purple-200"
                }
              >
                In progress
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-purple-700 flex gap-1">
                  <p className="font-bold">24</p> Open
                </div>
                <div className="text-green-700 flex gap-1">
                  <p className="font-bold">98</p> Done
                </div>
              </div>
              <div className="">
                {" "}
                <Image
                  color="inverse"
                  className="invert-100 border border-gray-400 rounded-full"
                  src={"/vercel.svg"}
                  alt="image"
                  width={0}
                  height={30}
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant={"secondary"}
        className="border rounded-xl border-gray-300 py-1.5 px-20 flex gap-4 items-center justify-center cursor-pointer"
      >
        View All Projects <ChevronRight className="" size={"20"} />
      </Button>
    </div>
  );
};

export default page;

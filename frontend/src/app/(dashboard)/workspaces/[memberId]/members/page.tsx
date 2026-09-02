"use client";

import Loading from "@/components/Loading";
import { AddMember } from "@/components/members/addMember";
import { DropdownMenuSubmenu } from "@/components/members/dropDown";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceMembers } from "@/lib/hooks/useMembers/useMembers";
import { UserPlusIcon, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const members = () => {
  const params = useParams();
  const memberId = params?.memberId as string;

  console.log(memberId);

  const { data: members, error, isPending } = useGetWorkspaceMembers(memberId);

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  if (isPending) {
    return <Loading />;
  }
  if (error) {
    return (
      <div className="text-red-500 flex items-center justify-center h-screen gap-2">
        {error.message}
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 lg:p-10">
      <div className="mx-auto flex-col sm:flex-row max-w-6xl gap-8">
        <div className="mx-auto flex-col sm:flex-row max-w-6xl gap-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Members
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Manage workspace members and there access.
            </p>
          </div>
          <Button
            onClick={toggleModal}
            className={"bg-blue-600 hover:bg-blue-700 rounded-xl"}
          >
            {" "}
            <UserPlusIcon /> Add Members
          </Button>
          <AddMember
            memberId={memberId}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>

        <div className="mt-4 flex items-center justify-center sm:justify-start">
          <p className="flex gap-2 items-center text-sm font-medium text-gray-500">
            <Users size={20} />{" "}
            {members && members?.length > 0 ? `${members?.length} Members` : ""}
          </p>
        </div>

        <div className="h-full flex  items-center justify-start mt-5 w-full">
          <table className="flex-col border rounded flex w-full items-center justify-center ">
            <thead className="w-full border-b p-4">
              <tr className="justify-between sm:flex-row items-center flex">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            {members && members?.length > 0
              ? members?.map((data: any) => (
                  <tbody
                    className="flex-col border-b w-full p-4 "
                    key={data?._id}
                  >
                    <tr className="justify-between items-center sm:flex-row flex-col gap-2 w-full flex flex-wrap overflow-x-clip">
                      <td>{data.user.name}</td>
                      <td className="">{data.user.email}</td>
                      <td>
                        <p
                          className={
                            "px-3 py-0 rounded-sm font-bold bg-purple-300 text-purple-700 w-fit"
                          }
                        >
                          {data.role}
                        </p>{" "}
                      </td>
                      <td> {data.createdAt}</td>
                      <td>
                        {" "}
                        {/* Dropdown menu here */}
                        <DropdownMenuSubmenu memberId={data?._id} />
                      </td>
                    </tr>
                  </tbody>
                ))
              : ""}
          </table>
        </div>
      </div>
    </div>
  );
};

export default members;

import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, UserPlusIcon, Users } from "lucide-react";

export default function MembersPage() {
  return (
    <div className="flex-1 p-4 md:p-8 lg:p-10">
      <div className="mx-auto flex-col sm:flex-row max-w-6xl gap-8">
        <div className="mx-auto flex-col sm:flex-row max-w-6xl gap-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Members
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Manage workspace members and their access.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
            <UserPlusIcon /> Add Members
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center sm:justify-start">
          <p className="flex gap-2 items-center text-sm font-medium text-gray-500">
            <Users size={20} /> 6 Members
          </p>
        </div>

        <div className="h-full flex items-center justify-start mt-5 w-full">
          <table className="flex-col border rounded flex w-full items-center justify-center">
            <thead className="w-full border-b p-4">
              <tr className="justify-between sm:flex-row items-center flex">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="flex-col border-b w-full p-4">
              <tr className="justify-between items-center sm:flex-row flex-col gap-2 w-full flex flex-wrap overflow-x-clip">
                <td>Vaibhav Waghmode</td>
                <td>vwaghmode5757@gmail.com</td>
                <td>
                  <p className="px-3 py-0 rounded-sm font-bold bg-purple-300 text-purple-700 w-fit">
                    Admin
                  </p>
                </td>
                <td>May 12, 2024</td>
                <td>
                  <MoreVerticalIcon />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

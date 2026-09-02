import { LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen gap-2">
      {" "}
      <LoaderIcon className="animate-spin" size={20} />
      <span>Loading...</span>
    </div>
  );
};

export default Loading;

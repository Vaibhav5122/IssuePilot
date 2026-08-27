import React from "react";

type Props = {
  params: Promise<{ memberId: string }>;
};
const members = async ({ params }: Props) => {
  const { memberId } = await params;

  return (
    <div>
      <h1>Post: {memberId}</h1>
    </div>
  );
};

export default members;

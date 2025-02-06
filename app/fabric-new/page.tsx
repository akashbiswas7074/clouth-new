import React from "react";
import FabricsWithColors from "../components/ShirtCustomise/FabricColorSelect";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center pb-4 sm:pb-0 font-play w-full h-fit">
      <FabricsWithColors />
    </div>
  );
};

export default page;

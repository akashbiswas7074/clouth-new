import React from "react";
import FabricsWithColors from "../components/ShirtCustomise/FabricColorSelect";
import { ToastContainer } from "react-toastify";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-fit">
      <ToastContainer/>
      <FabricsWithColors />
    </div>
  );
};

export default page;

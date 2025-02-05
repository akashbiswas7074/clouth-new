import React from "react";
import MonogramCustomiser from "../components/MonogramCustomise";
import { ToastContainer } from "react-toastify";

const page = () => {
  return (
    <div className="w-full">
      <ToastContainer />
      <MonogramCustomiser />
    </div>
  );
};

export default page;

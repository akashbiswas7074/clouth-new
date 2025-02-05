import React from "react";
import MonogramCustomizer from "../components/MonogramCustomise";
import { ToastContainer } from "react-toastify";

const page = () => {
  return (
    <div className="w-full">
      <ToastContainer />
      <MonogramCustomizer />
    </div>
  );
};

export default page;

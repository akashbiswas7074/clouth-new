import React from "react";
import SectionSelector from "../components/ShirtCustomise/ShirtFeaturesSelect";
import { ToastContainer } from "react-toastify";
const page = () => {
  return (
    <div className="w-full pt-8 font-play">
      <ToastContainer/>
      <SectionSelector />
    </div>
  );
};

export default page;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ShirtMeasurementsForm from "../components/shirtMeasurement/ShirtMeasurementsForm";
import BodyMeasurementsForm from "../components/bodyMeasurement/BodyMeasurementsForm";
import {
  Measurement,
  ShirtMeasurements,
  BodyMeasurements,
} from "@/app/utils/data/measurement";
import { createMeasurement } from "@/lib/database/actions/measurement.actions";
import { updateShirtIds } from "@/lib/database/actions/admin/ShirtArea/Shirt/shirt.actions";
import { addShirtToCart } from "@/lib/database/actions/cart.actions";
import { toast } from "sonner";
import { ToastContainer } from "react-toast";

const Page = () => {
  const router = useRouter();
  const { user } = useUser();
  const [shirtMeasurements, setShirtMeasurements] = useState<
    ShirtMeasurements | undefined
  >();
  const [bodyMeasurements, setBodyMeasurements] = useState<
    BodyMeasurements | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   console.log("user:", user)
  // }, [])
  const handleShirtMeasurementsChange = (measurements: ShirtMeasurements) => {
    setShirtMeasurements(measurements);
  };

  const handleBodyMeasurementsChange = (measurements: BodyMeasurements) => {
    setBodyMeasurements(measurements);
  };

  const addShirt = async () => {
    if (!user) {
      toast.error("User not logged in!");
      return;
    }
    const shirtId = localStorage.getItem("shirtId");
    const userId = user.id;
    console.log(userId);
    if (!shirtId) {
      throw new Error("Shirt ID not found in localStorage!");
    }
    const cartResponse = await addShirtToCart(userId, shirtId);

    if (!cartResponse.success) {
      throw new Error(cartResponse.message);
    }

    useEffect(() => {
      addShirt();
    }, []);
    // 4️⃣ Success: Notify and Redirect
    toast.success("Measurements saved and shirt added to cart!");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Get logged-in user

    if (!user) {
      toast.error("User not logged in!");
      return;
    }

    // const userId = user.id;
    // console.log(userId);;
    const shirtId = localStorage.getItem("shirtId");

    if (!shirtId) {
      toast.error("Shirt ID not found in localStorage!");
      return;
    }

    try {
      // 1️⃣ Create measurement
      const measurementResponse = await createMeasurement({
        shirt: shirtMeasurements,
        body: bodyMeasurements,
      });

      if (!measurementResponse.success) {
        throw new Error(measurementResponse.message);
      }

      // 2️⃣ Update Shirt ID
      const updateResponse = await updateShirtIds(
        shirtId,
        undefined,
        measurementResponse.id as string
      );

      if (!updateResponse.success) {
        throw new Error(updateResponse.message);
      }

      // 3️⃣ Add Shirt to Cart
      // const cartResponse = await addShirtToCart(userId, shirtId);

      // if (!cartResponse.success) {
      //   throw new Error(cartResponse.message);
      // }

      // // 4️⃣ Success: Notify and Redirect
      // toast.success("Measurements saved and shirt added to cart!");
      localStorage.removeItem("shirtId");
      router.push("/cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-28 px-4 py-2 text-center">
        <p>Please sign in to continue</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pt-28 px-4 py-2 font-play">
      <ToastContainer />
      <div>
        <ShirtMeasurementsForm onChange={handleShirtMeasurementsChange} />
      </div>

      <div>
        <BodyMeasurementsForm onChange={handleBodyMeasurementsChange} />
      </div>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-[#c40600] px-4 py-2 text-white rounded-lg font-semibold"
          // disabled={isSubmitting}
        >
          submit
          {/* {isSubmitting ? "Saving..." : "Save Measurements"} */}
        </button>
      </div>
    </form>
  );
};

export default Page;

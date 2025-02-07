"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
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

  const handleShirtMeasurementsChange = (measurements: ShirtMeasurements) => {
    setShirtMeasurements(measurements);
  };

  const handleBodyMeasurementsChange = (measurements: BodyMeasurements) => {
    setBodyMeasurements(measurements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !user) return;
    setIsSubmitting(true);

    try {
      // 1. Create measurement
      const measurementResponse = await createMeasurement({
        shirt: shirtMeasurements,
        body: bodyMeasurements,
      });

      if (!measurementResponse.success) {
        throw new Error(measurementResponse.message);
      }

      // 2. Get shirtId from localStorage
      const shirtId = localStorage.getItem("shirtId");
      if (!shirtId) throw new Error("Shirt ID not found");

      // 3. Update shirt with measurement ID
      const updateResponse = await updateShirtIds(
        shirtId,
        undefined,
        measurementResponse.id as string
      );

      if (!updateResponse.success) {
        throw new Error(updateResponse.message);
      }

      // 4. Add shirt to cart
      const cartResponse = await addShirtToCart(shirtId, user.id);

      if (!cartResponse.success) {
        throw new Error(cartResponse.message);
      }

      // 5. Success - clean up and redirect
      toast.success("Measurements saved and shirt added to cart!");
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Measurements"}
        </button>
      </div>
    </form>
  );
};

export default Page;

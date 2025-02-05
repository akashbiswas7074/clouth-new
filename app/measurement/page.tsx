"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import ShirtMeasurementsForm from "../components/shirtMeasurement/ShirtMeasurementsForm";
import BodyMeasurementsForm from "../components/bodyMeasurement/BodyMeasurementsForm";
import {
  Measurement,
  ShirtMeasurements,
  BodyMeasurements,
} from "@/app/utils/data/measurement";
import { createMeasurement } from "@/lib/database/actions/measurement.actions";
import { toast } from "sonner";
import { updateShirtIds } from "@/lib/database/actions/admin/ShirtArea/Shirt/shirt.actions";

const Page = () => {
  const router = useRouter(); // Initialize useRouter hook

  const [shirtMeasurements, setShirtMeasurements] = useState<
    ShirtMeasurements | undefined
  >(undefined);
  const [bodyMeasurements, setBodyMeasurements] = useState<
    BodyMeasurements | undefined
  >(undefined);
  const [measurementId, setMeasurementId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a flag to track submission status

  const handleShirtMeasurementsChange = (measurements: ShirtMeasurements) => {
    setShirtMeasurements(measurements);
    console.log("Shirt Measurements:", measurements);
  };

  const handleBodyMeasurementsChange = (measurements: BodyMeasurements) => {
    setBodyMeasurements(measurements);
    console.log("Body Measurements:", measurements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions while already submitting

    setIsSubmitting(true); // Set submitting flag to true to prevent duplicate submissions

    const combinedMeasurements: Measurement = {
      shirt: shirtMeasurements,
      body: bodyMeasurements,
    };

    try {
      const response = await createMeasurement(combinedMeasurements);

      if (response.success) {
        setMeasurementId(response.id as string);

        const shirtId = localStorage.getItem("shirtId");
        if (!shirtId) throw new Error("Shirt ID not found in localStorage");

        const updateResponse = await updateShirtIds(
          shirtId,
          undefined,
          response.id as string
        );

        if (updateResponse.success) {
          toast(updateResponse.message);
        } else {
          throw new Error(updateResponse.message || "Failed to update shirt");
        }

        toast(response.message);

        // Redirect to the /monogram page after successful form submission
        router.push("/cart");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create measurement");
    } finally {
      setIsSubmitting(false); // Reset submitting flag after completion
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-28 px-4 py-2">
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
          disabled={isSubmitting} // Disable the button during submission
        >
          {isSubmitting ? "Saving..." : "Save Measurements"}
        </button>
      </div>
    </form>
  );
};

export default Page;

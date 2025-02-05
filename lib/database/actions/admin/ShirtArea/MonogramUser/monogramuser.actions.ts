"use server"

import { connectToDatabase } from "@/lib/database/connect";
import MonogramUserModel from "@/lib/database/models/shirtModel/MonogramUserModel";
import mongoose from "mongoose"; // Make sure mongoose is imported for ObjectId

// Monogram creation function
export const createMonogram = async (
  price: number,
  style: object,
  position: object,
  text: string,
  color: string
) => {
  try {
    await connectToDatabase();

    // Convert price to a number if it's not already a number
    const numericPrice = Number(price);

    if (isNaN(numericPrice)) {
      throw new Error("Invalid price value.");
    }

    // Create new monogram
    const newMonogram = new MonogramUserModel({
      style,
      position,
      text,
      color,
    });

    // Save the new monogram
    const savedMonogram = await newMonogram.save();

    // Convert the monogram to a plain object to avoid Mongoose-specific properties
    const plainMonogram = savedMonogram.toObject();

    return {
      message: "Monogram created successfully.",
      success: true,
      monogram: plainMonogram,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating monogram.",
      success: false,
    };
  }
};

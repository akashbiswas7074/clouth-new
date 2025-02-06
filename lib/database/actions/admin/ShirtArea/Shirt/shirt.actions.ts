"use server";

import ShirtModel from "@/lib/database/models/shirtModel/ShirtModel";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/database/connect";
import { addShirtToCart } from "../../../cart.actions";
import { useUser } from "@clerk/nextjs";

export const createShirt = async (
  price: number,
  bottom: object,
  back: object,
  sleeves: object,
  cuffStyle: object,
  cuffLinks: object,
  collarStyle: object,
  collarHeight: object,
  collarButton: object,
  placket: object,
  pocket: object,
  fit: object,
  watchCompatible: boolean,
  colorId: string,
  fabricId: string,
  clerkId: string
) => {
  try {
    await connectToDatabase();

    // Convert price to a number if it's not already a number
    const numericPrice = Number(price);

    if (isNaN(numericPrice)) {
      throw new Error("Invalid price value.");
    }

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    const newShirt = new ShirtModel({
      price: numericPrice,
      bottom,
      back,
      sleeves,
      cuffStyle,
      cuffLinks,
      collarStyle,
      collarHeight,
      collarButton,
      placket,
      pocket,
      fit,
      watchCompatible,
      colorId: colorObjectId,
      fabricId: fabricObjectId,
    });

    await newShirt.save();

    const plainShirt = newShirt.toObject();

    console.log("Shirt created successfully:", plainShirt);

    const cartResult = await addShirtToCart(newShirt._id.toString(), clerkId);
    if (!cartResult.success) {
      console.error("Failed to add shirt to cart:", cartResult.message);
    }

    return {
      message: "Shirt created successfully.",
      success: true,
      shirt: plainShirt,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating shirt.",
      success: false,
    };
  }
};

export const updateShirtIds = async (
  shirtId: string,
  monogramId?: string,
  measurementId?: string
) => {
  try {
    await connectToDatabase();

    // Prepare the update object dynamically
    const updateFields: Partial<{
      monogramId: mongoose.Types.ObjectId;
      measurementId: mongoose.Types.ObjectId;
    }> = {};

    // Only update the monogramId if it is provided
    if (monogramId) {
      updateFields.monogramId = new mongoose.Types.ObjectId(monogramId);
    }

    // Only update the measurementId if it is provided (do not overwrite if not passed)
    if (measurementId) {
      updateFields.measurementId = new mongoose.Types.ObjectId(measurementId);
    }

    // Update only the provided fields, leaving others unchanged
    const updatedShirt = await ShirtModel.findByIdAndUpdate(
      shirtId,
      { $set: updateFields },
      { new: true }
    ).lean(); // Convert Mongoose document to a plain object

    if (!updatedShirt) {
      return { message: "Shirt not found.", success: false };
    }

    return {
      message: "Shirt updated successfully.",
      success: true,
      shirt: updatedShirt,
    };
  } catch (error: any) {
    console.error(error);
    return { message: "Error updating shirt.", success: false };
  }
};

export const getShirtById = async (shirtId: string) => {
  try {
    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(shirtId)) {
      return { message: "Invalid shirt ID.", success: false };
    }

    // Fetch the shirt by its ID and populate all related fields
    const shirt = await ShirtModel.findById(shirtId)
      .populate("colorId") // Populate the full color document
      .populate("fabricId") // Populate the full fabric document
      .populate("monogramId") // Populate the full monogram document
      .populate("measurementId") // Populate the full measurement document
      .lean(); // Convert Mongoose document to a plain JavaScript object

    // If no shirt is found, return an error
    if (!shirt) {
      return { message: "Shirt not found.", success: false };
    }

    return { message: "Shirt fetched successfully.", success: true, shirt };
  } catch (error) {
    console.error(error);
    return { message: "Error fetching shirt.", success: false };
  }
};

export const updateShirtPrice = async (shirtId: string, price: number) => {
  try {
    await connectToDatabase();

    // Find the current shirt to get its existing price
    const shirt = await ShirtModel.findById(shirtId);

    if (!shirt) {
      return { message: "Shirt not found.", success: false };
    }

    // Calculate the updated price
    const updatedPrice = (shirt.price || 0) + price;

    // Update the shirt's price
    const updatedShirt = await ShirtModel.findByIdAndUpdate(
      shirtId,
      { $set: { price: updatedPrice } },
      { new: true }
    ).lean(); // Convert Mongoose document to a plain object

    return {
      message: "Shirt price updated successfully.",
      success: true,
      shirt: updatedShirt,
    };
  } catch (error: any) {
    console.error(error);
    return { message: "Error updating shirt price.", success: false };
  }
};

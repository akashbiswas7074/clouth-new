"use server";

import ShirtModel from "@/lib/database/models/shirtModel/ShirtModel";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/database/connect";

export const createShirt = async (
  price: number,
  bottom: object,
  back: object,
  sleeves: object,
  cuffstyle: object,
  cufflinks: object,
  collarstyle: object,
  collarheight: object,
  collarbutton: object,
  placket: object,
  pocket: object,
  fit: object,
  watchCompatible: boolean,
  colorId: string,
  fabricId: string
) => {
  try {
    await connectToDatabase();
    
    // Create ObjectIds
    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    const newShirt = await ShirtModel.create({
      price,
      bottom,
      back,
      sleeves,
      cuffstyle,
      cufflinks,
      collarstyle,
      collarheight,
      collarbutton,
      placket,
      pocket,
      fit,
      watchCompatible,
      colorId: colorObjectId,
      fabricId: fabricObjectId,
    });

    // Convert to plain object and transform
    const plainShirt = {
      id: newShirt._id.toString(),
      price: newShirt.price,
      bottom: newShirt.bottom,
      back: newShirt.back,
      sleeves: newShirt.sleeves,
      cuffstyle: newShirt.cuffstyle,
      cufflinks: newShirt.cufflinks,
      collarstyle: newShirt.collarstyle,
      collarheight: newShirt.collarheight,
      collarbutton: newShirt.collarbutton,
      placket: newShirt.placket,
      pocket: newShirt.pocket,
      fit: newShirt.fit,
      watchCompatible: newShirt.watchCompatible,
      colorId: newShirt.colorId.toString(),
      fabricId: newShirt.fabricId.toString(),
    };

    return {
      message: "Shirt created successfully.",
      success: true,
      shirt: plainShirt
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
    const updateFields: Partial<{ monogramId: mongoose.Types.ObjectId; measurementId: mongoose.Types.ObjectId }> = {};

    if (monogramId) {
      updateFields.monogramId = new mongoose.Types.ObjectId(monogramId);
    }
    if (measurementId) {
      updateFields.measurementId = new mongoose.Types.ObjectId(measurementId);
    }

    // Update only the provided fields
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
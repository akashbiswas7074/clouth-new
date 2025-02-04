import connectToDatabase from "@/lib/database/connect";

import ShirtModel from "@/lib/database/models/shirtModel/ShirtModel";
import mongoose from "mongoose";

export const createShirt = async (
  price: number,
  bottom: object, // Now expecting object
  back: object, // Now expecting object
  sleeves: object, // Now expecting object
  cuffstyle: object, // Now expecting object
  cufflinks: object, // Now expecting object
  collarstyle: object, // Now expecting object
  collarheight: object, // Now expecting object
  collarbutton: object, // Now expecting object
  placket: object, // Now expecting object
  pocket: object, // Now expecting object
  fit: object, // Now expecting object
  watchCompatible: boolean, // Boolean value
  colorId: string, // Color ID (MongoDB Object ID)
  fabricId: string, // Fabric ID (MongoDB Object ID)
) => {
  try {
    // Convert the incoming string IDs into MongoDB ObjectIds
    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    // Create the shirt document
    const newShirt = new ShirtModel({
      name,
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
      watchCompatible, // Boolean field
      colorId: colorObjectId,
      fabricId: fabricObjectId,
    });

    // Save the shirt to the database
    await newShirt.save();

    return {
      message: "Shirt created successfully.",
      success: true,
      shirt: newShirt,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error creating shirt.",
      success: false,
    };
  }
};


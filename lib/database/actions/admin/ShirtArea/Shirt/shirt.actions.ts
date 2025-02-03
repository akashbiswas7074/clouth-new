import { connectToDatabase } from "@/lib/database/connect";
import ShirtModel from "@/lib/database/models/shirtModel/ShirtModel";

// Create a new Shirt entry
export const createShirt = async (
  fit: object,
  pocket: object,
  placket: object,
  bottom: object,
  back: object,
  sleeves: object,
  collar: object,
  cuff: object,
  fabric: string, // MongoDB ObjectId as string
  color: string,  // MongoDB ObjectId as string
  monogram?: object
) => {
  try {
    await connectToDatabase();

    if (
      !fit || !pocket || !placket || !bottom || !back ||
      !sleeves || !collar || !cuff || !fabric || !color
    ) {
      return {
        message: "All required fields must be provided.",
        success: false,
      };
    }

    const newShirt = new ShirtModel({
      fit,
      pocket,
      placket,
      bottom,
      back,
      sleeves,
      collar,
      cuff,
      fabric,
      color,
      monogram,
    });

    const savedShirt = await newShirt.save();
    return {
      message: "Shirt successfully created!",
      success: true,
      data: savedShirt,
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "Error creating shirt.",
      success: false,
    };
  }
};

// Update Shirt by ID
export const updateShirt = async (
  shirtId: string,
  updates: {
    fit?: object,
    pocket?: object,
    placket?: object,
    bottom?: object,
    back?: object,
    sleeves?: object,
    collar?: object,
    cuff?: object,
    fabric?: string,
    color?: string,
    monogram?: object
  }
) => {
  try {
    await connectToDatabase();

    const shirt = await ShirtModel.findById(shirtId);
    if (!shirt) {
      return {
        message: "Shirt not found with this ID.",
        success: false,
      };
    }

    Object.assign(shirt, updates);
    const updatedShirt = await shirt.save();

    return {
      message: "Shirt updated successfully!",
      success: true,
      data: updatedShirt,
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "Error updating shirt.",
      success: false,
    };
  }
};

// Delete Shirt by ID
export const deleteShirt = async (shirtId: string) => {
  try {
    await connectToDatabase();

    const deletedShirt = await ShirtModel.findByIdAndDelete(shirtId);
    if (!deletedShirt) {
      return {
        message: "Shirt not found with this ID.",
        success: false,
      };
    }

    return {
      message: "Shirt deleted successfully.",
      success: true,
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "Error deleting shirt.",
      success: false,
    };
  }
};

// Get all Shirts
export const getAllShirts = async () => {
  try {
    await connectToDatabase();

    const shirts = await ShirtModel.find()
      .sort({ updatedAt: -1 })
      .lean();

    return {
      message: "Fetched all shirts successfully.",
      success: true,
      data: JSON.parse(JSON.stringify(shirts)),
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "Error fetching shirts.",
      success: false,
      data: [],
    };
  }
};

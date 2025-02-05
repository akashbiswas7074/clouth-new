"use server";

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import MonogramModel from "@/lib/database/models/shirtModel/MonogramModel";
import { connectToDatabase } from "@/lib/database/connect";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Helper function to convert base64 string to buffer
const base64ToBuffer = (base: string) => {
  const base64String = base.split(";base64,").pop();
  return Buffer.from(base64String || "", "base64");
};

// Function to upload image to Cloudinary
const uploadImage = async (base64Image: string, uploadPreset: string) => {
  try {
    const imageBuffer = base64ToBuffer(base64Image);
    const formData = new FormData();
    formData.append("file", new Blob([imageBuffer], { type: "image/jpeg" }));
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    return await response.json();
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image.");
  }
};

// Create a new Monogram entry
export const createMonogram = async (
  style: {
    name?: string;
    image?: string; // Base64 string for style image upload
    price?: number;
  },
  position: {
    name?: string;
    image?: string; // Base64 string for position image upload
    price?: number;
  },
  fabricId: string,
  colorId: string
) => {
  try {
    if (!fabricId || !colorId) {
      return {
        message: "Fabric ID and Color ID are required.",
        success: false,
      };
    }

    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId);
    const colorObjectId = new mongoose.Types.ObjectId(colorId);

    let uploadedStyleImage, uploadedPositionImage;

    if (style?.image) {
      uploadedStyleImage = await uploadImage(
        style.image,
        "monogram_style_images"
      );
    }

    if (position?.image) {
      uploadedPositionImage = await uploadImage(
        position.image,
        "monogram_position_images"
      );
    }

    const monogram = new MonogramModel({
      style: {
        name: style.name || "",
        image: uploadedStyleImage
          ? {
              url: uploadedStyleImage.secure_url,
              public_id: uploadedStyleImage.public_id,
            }
          : undefined,
        price: style.price || 0,
      },
      position: {
        name: position.name || "",
        image: uploadedPositionImage
          ? {
              url: uploadedPositionImage.secure_url,
              public_id: uploadedPositionImage.public_id,
            }
          : undefined,
        price: position.price || 0,
      },
      fabricId: fabricObjectId,
      colorId: colorObjectId,
    });

    await monogram.save();

    return {
      message: "Monogram has been successfully created.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating monogram:", error);
    return {
      message: "Error creating monogram.",
      success: false,
    };
  }
};

export const getMonogramsByColorAndFabric = async (
  fabricId: string,
  colorId: string
) => {
  try {
    await connectToDatabase();

    const fabricObjectId = new mongoose.Types.ObjectId(fabricId); // Convert string to ObjectId
    const colorObjectId = new mongoose.Types.ObjectId(colorId); // Convert string to ObjectId

    const Monograms = await MonogramModel.find({
      fabricId: fabricObjectId,
      colorId: colorObjectId,
    }) // Correct field name
      .sort({ updatedAt: -1 }) // Sorting by latest updated
      .lean();

    return JSON.parse(JSON.stringify(Monograms));
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const deleteMonogram = async (monogramId: string) => {
  try {
    await connectToDatabase();

    const monogram = await MonogramModel.findById(monogramId);

    if (!monogram) {
      return {
        message: "Monogram not found with this ID!",
        success: false,
      };
    }

    // Delete images from Cloudinary
    const styleImagePublicId = monogram.style.image.public_id;
    const positionImagePublicId = monogram.position.image.public_id;

    await cloudinary.v2.uploader.destroy(styleImagePublicId);
    await cloudinary.v2.uploader.destroy(positionImagePublicId);

    // Delete monogram document from MongoDB
    await MonogramModel.findByIdAndDelete(monogramId);

    return {
      message:
        "Successfully deleted monogram and its associated images from Cloudinary.",
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Error deleting monogram.",
      success: false,
    };
  }
};

"use server";

import { connectToDatabase } from "../connect";
import Cart from "../models/cart.model";
import User from "../models/user.model";
import ShirtModel from "../models/shirtModel/ShirtModel";
import mongoose from "mongoose";
import { getShirtById } from "./admin/ShirtArea/Shirt/shirt.actions";
import { getUserById } from "@/lib/database/actions/user.actions"; // Import the function to get user by ID

export async function addShirtToCart(shirtId: string, clerkId: string) {
  try {
    await connectToDatabase();

    if (!clerkId) {
      throw new Error("ClerkId is required");
    }

    // Find user with better error handling
    const user = await getUserById(clerkId); // Fetch user by ID
    if (!user) {
      console.error(`No user found for clerkId: ${clerkId}`);
      throw new Error("User not found. Please ensure you're logged in.");
    }

    //finding shirt
    const shirt = await getShirtById(shirtId);
    if (!shirt) {
      throw new Error("Shirt not found");
    }

    // Find shirt
    // const shirt = await ShirtModel.findById(shirtId);
    // if (!shirt) {
    //   throw new Error("Shirt not found");
    // }

    // Find or create cart with explicit error handling
    let cart = await Cart.findOne({ user: user.user._id });
    if (!cart) {
      cart = new Cart({
        user: user.user._id,
        products: [],
        cartTotal: 0,
      });
    }

    // Add product with better validation
    const existingProductIndex = cart.products.findIndex(
      (item: any) => item.product.toString() === shirtId
    );

    if (existingProductIndex > -1) {
      // Update existing product quantity
      cart.products[existingProductIndex].qty = (
        parseInt(cart.products[existingProductIndex].qty) + 1
      ).toString();
    } else {
      // Add new product
      cart.products.push({
        product: shirtId,
        qty: "1",
        price: shirt.shirt?.price || 0,
      });
    }

    // Recalculate cart total
    cart.cartTotal = cart.products.reduce(
      (total: number, item: any) => total + item.price * parseInt(item.qty),
      0
    );

    await cart.save();

    return {
      success: true,
      message: "Added to cart successfully",
      cart: cart.toObject(),
    };
  } catch (error: any) {
    console.error("Error in addShirtToCart:", error);
    return {
      success: false,
      message: error.message || "Failed to add to cart",
    };
  }
}

export async function getSavedCartForUser(clerkId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId }).lean();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const cart = await Cart.findOne({ user: (user as any)._id })
      .populate({
        path: "products.product",
        model: "Shirt", // Updated model name to match Shirt registration
        populate: [
          { path: "colorId" },
          { path: "fabricId" },
          { path: "monogramId" },
          { path: "measurementId" },
        ],
      })
      .lean();

    // Convert cart to a plain object
    const plainCart = cart ? JSON.parse(JSON.stringify(cart)) : null;
    return { success: true, cart: plainCart };
  } catch (error: any) {
    return { success: false, message: error.message || "Error fetching cart" };
  }
}

export async function updateCartItemQuantity(
  clerkId: string,
  productId: string,
  newQty: number
) {
  try {
    await connectToDatabase();

    // Find the user by clerkId
    const user = await User.findOne({ clerkId }).lean();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Find the user's cart (do not use .lean() since we need to update)
    const cart = await Cart.findOne({ user: (user as any)._id });
    if (!cart) {
      return { success: true, cart: null };
    }

    // Adjust index check to handle populated product objects
    const index = cart.products.findIndex((item: any) => {
      const prodId = item.product._id
        ? item.product._id.toString()
        : item.product.toString();
      return prodId === productId;
    });
    if (index === -1) {
      return { success: false, message: "Product not in cart" };
    }

    if (newQty <= 0) {
      // Optionally remove the product from cart if quantity is set to zero or less
      cart.products.splice(index, 1);
    } else {
      cart.products[index].qty = newQty.toString();
    }

    await cart.save();
    return { success: true, cart };
  } catch (error: any) {
    return { success: false, message: error.message || "Error updating cart" };
  }
}

// ...existing code...

export async function deleteShirtFromCart(clerkId: string, productId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    // Remove product from cart
    cart.products = cart.products.filter(
      (item: any) => item.product.toString() !== productId
    );

    // Recalculate cart total
    cart.cartTotal = cart.products.reduce(
      (total: any, item: any) => total + item.price * parseInt(item.qty),
      0
    );

    await cart.save();

    // Get populated cart data
    const updatedCart = await Cart.findById(cart._id).populate({
      path: "products.product",
      populate: [
        { path: "colorId" },
        { path: "fabricId" },
        { path: "measurementId" },
      ],
    });

    return {
      success: true,
      message: "Product removed from cart",
      cart: updatedCart,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error removing product from cart",
    };
  }
}

export async function deleteAllCart(clerkId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    // Clear cart
    cart.products = [];
    cart.cartTotal = 0;
    cart.totalAfterDiscount = 0;

    await cart.save();

    return {
      success: true,
      message: "Cart cleared successfully",
      cart,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error clearing cart",
    };
  }
}

// ...existing code...

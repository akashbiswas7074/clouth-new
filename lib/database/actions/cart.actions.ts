"use server";

import { connectToDatabase } from "../connect";
import Cart from "../models/cart.model";
import User from "../models/user.model";
import ShirtModel from "../models/shirtModel/ShirtModel";
import mongoose from "mongoose";

export async function addShirtToCart(shirtId: string, clerkId: string) {
  try {
    await connectToDatabase();

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(shirtId)) {
      return { success: false, message: "Invalid shirt ID" };
    }

    // Find user
    const user = await User.findOne({ clerkId }).lean();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Find shirt with all details
    const shirt = await ShirtModel.findById(shirtId)
      .populate('colorId')
      .populate('fabricId')
      .populate('monogramId')
      .populate('measurementId')
      .lean();

    if (!shirt) {
      return { success: false, message: "Shirt not found" };
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: (user as any)._id });
    
    if (!cart) {
      cart = new Cart({
        user: (user as any)._id,
        products: [],
        cartTotal: 0
      });
    }

    // Add product to cart
    const cartItem = {
      product: shirtId,
      qty: "1",
      price: (shirt as any).price || 0
    };

    cart.products.push(cartItem);

    // Update cart total
    interface CartItem {
      price: number;
      qty: string;
    }

    cart.cartTotal = cart.products.reduce((total: number, item: CartItem) => 
      total + (item.price * Number(item.qty)), 0
    );

    await cart.save();

    // Get updated cart with populated products
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'products.product',
        model: ShirtModel,
        populate: [
          { path: 'colorId' },
          { path: 'fabricId' },
          { path: 'monogramId' },
          { path: 'measurementId' }
        ]
      })
      .lean();

    return {
      success: true,
      message: "Added to cart successfully",
      cart: updatedCart
    };

  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      message: error.message || "Failed to add to cart"
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

export async function updateCartItemQuantity(clerkId: string, productId: string, newQty: number) {
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
      const prodId = item.product._id ? item.product._id.toString() : item.product.toString();
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

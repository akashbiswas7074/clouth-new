"use server";

import { connectToDatabase } from "../connect";
import Cart from "../models/cart.model";
import User from "../models/user.model";
import ShirtModel from "../models/shirtModel/ShirtModel";

export async function addShirtToCart(shirtId: string, clerkId: string) {
  try {
    await connectToDatabase();
    
    // Debug: log the clerkId
    console.debug("addShirtToCart: clerkId", clerkId);

    const user = await User.findOne({ clerkId }).lean();
    if (!user) {
      console.error("addShirtToCart: User not found for clerkId", clerkId);
      return { success: false, message: "User not found" };
    }
    console.debug("addShirtToCart: user found", user);

    const shirt = await ShirtModel.findById(shirtId).lean();
    if (!shirt) {
      console.error("addShirtToCart: Shirt not found for id", shirtId);
      return { success: false, message: "Shirt not found" };
    }
    console.debug("addShirtToCart: shirt found", shirt);

    // Convert ObjectIds to strings
    const plainShirt = {
      ...shirt,
      id: shirt._id.toString(),
      colorId: shirt.colorId?.toString(),
      fabricId: shirt.fabricId?.toString(),
    };
    delete plainShirt._id;
    delete plainShirt.__v;
    console.debug("addShirtToCart: plainShirt", plainShirt);

    let cart = await Cart.findOne({ user: user._id }).lean();
    if (!cart) {
      console.debug("addShirtToCart: No existing cart found, creating one.");
      cart = await Cart.create({
        products: [],
        cartTotal: 0,
        user: user._id
      });
      // Convert newly created cart to plain object for consistency
      cart = cart.toObject();
    }
    console.debug("addShirtToCart: current cart", cart);

    const cartProduct = {
      product: shirtId,
      qty: "1",
      price: plainShirt.price
    };
    console.debug("addShirtToCart: Adding product", cartProduct);

    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $push: { products: cartProduct },
        $inc: { cartTotal: plainShirt.price }
      },
      { new: true }
    ).lean();

    if (!updatedCart) {
      console.error("addShirtToCart: Failed to update cart for id", cart._id);
      return { success: false, message: "Error updating cart" };
    }

    console.debug("addShirtToCart: Updated cart", updatedCart);

    return {
      success: true,
      message: "Shirt added to cart successfully",
      cart: {
        ...updatedCart,
        id: updatedCart._id.toString(),
        user: updatedCart.user.toString()
      }
    };
  } catch (error: any) {
    console.error("Error adding shirt to cart:", error.message, error);
    return { success: false, message: "Error adding shirt to cart" };
  }
}
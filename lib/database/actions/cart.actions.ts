"use server";

import { connectToDatabase } from "../connect";
import Cart from "../models/cart.model";
import User from "../models/user.model";
import ShirtModel from "../models/shirtModel/ShirtModel";

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
    let cart = await Cart.findOne({ user: user._id });
    
    if (!cart) {
      cart = new Cart({
        user: user._id,
        products: [],
        cartTotal: 0
      });
    }

    // Add product to cart
    const cartItem = {
      product: shirtId,
      qty: "1",
      price: shirt.price || 0
    };

    cart.products.push(cartItem);

    // Update cart total
    cart.cartTotal = cart.products.reduce((total, item) => 
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

    const cart = await Cart.findOne({ user: user._id })
      .populate({
        path: "products.product",
        model: ShirtModel,
        populate: [
          { path: 'colorId' },
          { path: 'fabricId' },
          { path: 'monogramId' },
          { path: 'measurementId' }
        ]
      })
      .lean();

    if (!cart) {
      return { success: true, cart: null };
    }

    // Format cart data with all details
    const formattedCart = {
      ...cart,
      _id: cart._id.toString(),
      user: cart.user.toString(),
      products: cart.products.map((item: any) => ({
        ...item,
        product: {
          ...item.product,
          _id: item.product._id.toString(),
          colorId: item.product.colorId?.toString(),
          fabricId: item.product.fabricId?.toString(),
          monogramId: item.product.monogramId?.toString(),
          measurementId: item.product.measurementId?.toString(),
          // Ensure all object fields are present
          collarStyle: item.product.collarStyle || null,
          collarButton: item.product.collarButton || null,
          collarHeight: item.product.collarHeight || null,
          cuffStyle: item.product.cuffStyle || null,
          cuffLinks: item.product.cuffLinks || null,
          watchCompatible: item.product.watchCompatible || false,
          bottom: item.product.bottom || null,
          back: item.product.back || null,
          pocket: item.product.pocket || null,
          placket: item.product.placket || null,
          sleeves: item.product.sleeves || null,
          fit: item.product.fit || null
        }
      }))
    };

    return {
      success: true,
      cart: formattedCart
    };

  } catch (error: any) {
    console.error("Error retrieving cart:", error);
    return { success: false, message: "Error retrieving cart" };
  }
}


export async function updateCartItemQuantity(clerkId: string, productId: string, newQty: number) {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ clerkId }).lean();
    if (!user) return { success: false, message: "User not found" };

    const cart = await Cart.findOne({ user: user.clerkId });
    if (!cart) return { success: false, message: "Cart not found" };

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) return { success: false, message: "Product not found" };

    // Update quantity and recalculate total
    cart.products[productIndex].qty = newQty.toString();
    cart.cartTotal = cart.products.reduce((total, item) => 
      total + (item.price * parseInt(item.qty)), 0
    );

    await cart.save();

    // Get updated cart with populated products
    const updatedCart = await Cart.findById(cart._id)
      .populate('products.product')
      .lean();

    return { success: true, cart: updatedCart };
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, message: "Failed to update cart" };
  }
}

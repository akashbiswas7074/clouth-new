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

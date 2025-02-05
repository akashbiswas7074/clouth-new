"use server";

import { connectToDatabase } from "../connect";
import Order from "../models/order.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";

const { ObjectId } = mongoose.Types;

export async function createOrder(
  products: {
    product: string;
    name: string;
    image: string;
    size: string;
    qty: number;
    color: { color: string; image: string };
    price: number;
    status: string;
    productCompletedAt: Date | null;
    _id: string;
  }[],
  shippingAddress: {
    phoneNumber: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  },
  paymentMethod: "paypal" | "cash_on_delivery",
  total: number,
  totalBeforeDiscount: number,
  couponApplied: string,
  userId: string,
  totalSaved: number
) {
  try {
    await connectToDatabase();

    // If userId is not a valid ObjectId, assume it's a clerkId.
    let user;
    if (ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ clerkId: userId });
    }
    
    if (!user) {
      return {
        message: "User not found with provided ID!",
        success: false,
        orderId: null,
      };
    }

    const newOrder = await new Order({
      user: user._id,
      products: products.map((product) => ({
        product: product._id,
        qty: product.qty.toString(),
        price: product.price,
      })),
      orderAddress: {
        ...shippingAddress,
        active: true,
      },
      paymentMethod,
      cartTotal: total,
      totalAfterDiscount: totalBeforeDiscount,
      // For cash on delivery orders, we confirm immediately and use pending status
      orderConfirmation: paymentMethod === "cash_on_delivery" ? true : false,
      deliveryStatus: "pending",
      price: total,
      deliveryCost: 0,
      // For cash on delivery, set paymentTime at order placement; others can update later
      paymentTime: new Date(),
      // If cash_on_delivery, receipt shows a default note
      receipt: paymentMethod === "cash_on_delivery" ? "Cash payment pending" : "",
    }).save();

    // Add the order to the user's orders array
    user.orders = user.orders || [];
    user.orders.push(newOrder._id);
    await user.save();

    return {
      message: "Order created successfully",
      orderId: JSON.parse(JSON.stringify(newOrder._id)),
      success: true,
    };

  } catch (error: any) {
    console.error("Error creating order:", error);
    return {
      message: error.message || "Failed to create order",
      success: false,
      orderId: null,
    };
  }
}

export const getOrderDetailsById = unstable_cache(
  async (orderId: string) => {
    try {
      if (!ObjectId.isValid(orderId)) {
        return {
          message: "Invalid order ID format",
          success: false,
        };
      }

      await connectToDatabase();
      
      const order = await Order.findById(orderId)
        .populate("products.product");

      if (!order) {
        return {
          message: "Order not found",
          success: false,
        };
      }

      return {
        order: JSON.parse(JSON.stringify(order)),
        success: true,
      };

    } catch (error: any) {
      return {
        message: error.message || "Failed to fetch order details",
        success: false,
      };
    }
  },
  ["order_details"],
  {
    revalidate: 300,
  }
);

export async function updateOrderPaymentStatus(
  orderId: string,
  paypalTransactionId: string
) {
  try {
    await connectToDatabase();
    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderConfirmation: true,
        receipt: paypalTransactionId,
        paymentTime: new Date(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return {
        message: "Order not found",
        success: false,
      };
    }

    return {
      message: "Payment status updated successfully",
      success: true,
      order: JSON.parse(JSON.stringify(updatedOrder)),
    };

  } catch (error: any) {
    return {
      message: error.message || "Failed to update payment status",
      success: false,
    };
  }
}

export async function getUserOrders(userId: string) {
  try {
    await connectToDatabase();
    
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .sort({ paymentTime: -1 });

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      success: true,
    };

  } catch (error: any) {
    return {
      message: error.message || "Failed to fetch user orders",
      success: false,
      orders: [],
    };
  }
}

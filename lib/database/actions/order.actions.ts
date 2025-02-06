"use server";

import { connectToDatabase } from "../connect";
import OrderModel from "../models/order.model";
import Order from "../models/order.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import ShirtModel from "../models/shirtModel/ShirtModel";

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

    const newOrder = await new OrderModel({
      userid : user.clerkId,
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

export async function getUserOrders(userid: string) {
  try {
    await connectToDatabase();
    
    console.log("Fetching orders for user:", userid); // Debug log

    const orders = await OrderModel.find({ userid })
      .populate({
        path: 'products.product',
        model: ShirtModel,
        populate: [
          { path: 'colorId' },
          { path: 'fabricId' },
          { path: 'measurementId' }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found orders:", orders); // Debug log

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      success: true,
    };

  } catch (error: any) {
    console.error("Error in getUserOrders:", error);
    return {
      message: error.message || "Failed to fetch user orders",
      success: false,
      orders: [],
    };
  }
}

export const fetchOrders = async () => {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log("Connected to database");

    // Fetch orders from the database, populate the 'products' field
    const orders = await OrderModel.find()
      .populate({
        path: "products.product",
        model: ShirtModel, // Use the imported ShirtModel
        select: "name price", // You can add any fields you want to fetch from the ShirtModel
      })
      .lean(); // Make the result plain JavaScript objects

    // Format dates and ObjectIds for client
    interface IProductReference {
      _id: string;
      [key: string]: any; // For other properties that might exist
    }

    interface IPopulatedProduct {
      colorId?: { _id: string; [key: string]: any } | null;
      fabricId?: { _id: string; [key: string]: any } | null;
      monogramId?: { _id: string; [key: string]: any } | null;
      measurementId?: { _id: string; [key: string]: any } | null;
      _id: string;
      [key: string]: any;
    }

    interface IOrderProduct {
      product: IPopulatedProduct;
      [key: string]: any;
    }

    interface IOrderUser {
      _id: string;
      name?: string;
      email?: string;
      [key: string]: any;
    }

    interface IOrder {
      _id: string;
      user: IOrderUser;
      products: IOrderProduct[];
      [key: string]: any;
    }

    interface IProductMapping {
      product: {
        _id: string;
        colorId?: { _id: string; [key: string]: any } | null;
        fabricId?: { _id: string; [key: string]: any } | null;
        monogramId?: { _id: string; [key: string]: any } | null;
        measurementId?: { _id: string; [key: string]: any } | null;
        [key: string]: any;
      };
      [key: string]: any;
    }

        const formattedOrders: IOrder[] = orders.map(order => ({
          ...order,
          _id: (order as any)._id.toString(),
          user: {
            ...order.user,
            _id: order.user._id.toString()
          },
          products: order.products.map((product: IProductMapping) => ({
            ...product,
            product: {
              ...product.product,
              _id: product.product._id.toString(),
              colorId: product.product.colorId?._id ? {
                ...product.product.colorId,
                _id: product.product.colorId._id.toString()
              } : null,
              fabricId: product.product.fabricId?._id ? {
                ...product.product.fabricId,
                _id: product.product.fabricId._id.toString()
              } : null,
              monogramId: product.product.monogramId?._id ? {
                ...product.product.monogramId,
                _id: product.product.monogramId._id.toString()
              } : null,
              measurementId: product.product.measurementId?._id ? {
                ...product.product.measurementId,
                _id: product.product.measurementId._id.toString()
              } : null
            }
          }))
        }));

    return {
      orders: formattedOrders,
      success: true
    };

  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return {
      message: error.message || "Failed to fetch orders",
      success: false,
      orders: []
    };
  }
};
import mongoose, { Schema, Document } from "mongoose";
import ShirtModel from "./shirtModel/ShirtModel";

export interface Order extends Document {
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId;
        ref: "ShirtModel";
      },
      qty: {
        type: String;
      },
      price: number;
    }
  ],
  cartTotal: number,
  totalAfterDiscount: number,
  orderConfirmation: boolean;
  deliveryStatus: "pending" | "shipped" | "delivered";
  price: number;
  deliveryCost: number;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";
  paymentTime: Date;
  receipt: string;
  orderAddress: {
    phoneNumber: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    active: boolean;
  };
}

export const OrderSchema = new Schema<Order>({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShirtModel",
      },
      qty: {
        type: String,
      },
      price: Number,
    },
  ],
  cartTotal: Number,
  totalAfterDiscount: Number,
  orderConfirmation: { type: Boolean, required: true },
  deliveryStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    required: true,
    default: "pending",
  },
  price: { type: Number, required: true },
  deliveryCost: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
    required: true,
  },
  paymentTime: { type: Date, required: true },
  receipt: { type: String, default: "" },
  orderAddress: {
    phoneNumber: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    active: { type: Boolean, default: true },
  },
});

// Prevent OverwriteModelError on hot reloads in development
const OrderModel = mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);

export default OrderModel;

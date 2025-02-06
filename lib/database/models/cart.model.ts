import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Shirt",
        },
        qty: {
          type: String,
        },
        price: Number,
      },
    ],
    cartTotal: {
      type: Number,
      default: 0,
    },
    totalAfterDiscount: Number,
    user: String,
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;

import mongoose, { Schema, Document } from "mongoose";

// Define the Monogram schema with embedded image objects
export interface Monogram extends Document {
  style: {
    name: string;
    image: { url: string; public_id: string };
    price: number;
  };
  position: {
    name: string;
    image: { url: string; public_id: string };
    price: number;
  };
  fabricId: mongoose.Types.ObjectId;
  colorId: mongoose.Types.ObjectId;
}

export const MonogramSchema = new Schema<Monogram>({
  style: {
    name: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    price: { type: Number, required: true },
  },
  position: {
    name: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    price: { type: Number, required: true },
  },
  fabricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric",
    required: true,
  }, // Updated field name
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  }, // Updated field name
});

const MonogramModel =
  mongoose.models.Monogram ||
  mongoose.model<Monogram>("Monogram", MonogramSchema);

export default MonogramModel;

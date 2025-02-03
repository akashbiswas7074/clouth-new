import mongoose, { Schema, Document } from "mongoose";

// Define the Monogram schema with embedded image objects
export interface Monogram extends Document {
  enabled: boolean;
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
  color: {
    name: string;
    image: { url: string; public_id: string };
    price: number;
  };
  block: string;
  script: { text: string; design: { url: string; public_id: string } };
  fabricId: mongoose.Types.ObjectId;
  colorId: mongoose.Types.ObjectId;
}

export const MonogramSchema = new Schema<Monogram>({
  enabled: { type: Boolean, required: true },
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
  color: {
    name: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    price: { type: Number, required: true },
  },
  block: { type: String },
  script: {
    text: { type: String },
    design: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
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

const MonogramModel = mongoose.model<Monogram>("Monogram", MonogramSchema);

export default MonogramModel;

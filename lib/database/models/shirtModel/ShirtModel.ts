import mongoose, { Schema } from "mongoose";

// Define the interfaces for each object field (e.g., CollarStyle, CuffStyle, etc.)
interface ProductItem {
  name: string;
  image: string;
  price: string;
}

interface Shirt {
  price: number;
  collarStyle?: ProductItem;
  collarButton?: ProductItem;
  collarHeight?: ProductItem;
  cuffStyle?: ProductItem;
  cuffLinks?: ProductItem;
  watchCompatible?: boolean;
  bottom?: ProductItem;
  back?: ProductItem;
  pocket?: ProductItem;
  placket?: ProductItem;
  sleeves?: ProductItem;
  fit?: ProductItem;
  colorId?: mongoose.Schema.Types.ObjectId;
  fabricId?: mongoose.Schema.Types.ObjectId;
  monogramId?: mongoose.Schema.Types.ObjectId;
  measurementId?: mongoose.Schema.Types.ObjectId;
}

const ShirtSchema = new Schema<Shirt>({
  price: {
    type: Number,
    required: true, // Make it required
  },
  collarStyle: {
    type: Object, // Could store an object for collarStyle details
    required: false,
  },
  collarButton: {
    type: Object, // Could store an object for collarButton details
    required: false,
  },
  collarHeight: {
    type: Object, // Could store an object for collarHeight details
    required: false,
  },
  cuffStyle: {
    type: Object, // Could store an object for cuffStyle details
    required: false,
  },
  cuffLinks: {
    type: Object, // Could store an object for cuffLinks details
    required: false,
  },
  watchCompatible: {
    type: Boolean, // Store whether the shirt is watch compatible
    required: false,
  },
  bottom: {
    type: Object, // Could store an object for bottom details
    required: false,
  },
  back: {
    type: Object, // Could store an object for back details
    required: false,
  },
  pocket: {
    type: Object, // Could store an object for pocket details
    required: false,
  },
  placket: {
    type: Object, // Could store an object for placket details
    required: false,
  },
  sleeves: {
    type: Object, // Could store an object for sleeves details
    required: false,
  },
  fit: {
    type: Object, // Could store an object for fit details
    required: false,
  },
  colorId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Color model
    required: false,
  },
  fabricId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Fabric model
    required: false,
  },
  monogramId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Monogram model
    required: false,
  },
  measurementId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Measurement model
    required: false,
  },
});

// Create the model using the schema
const ShirtModel =
  mongoose.models.Shirt || mongoose.model<Shirt>("Shirt", ShirtSchema);

export default ShirtModel;

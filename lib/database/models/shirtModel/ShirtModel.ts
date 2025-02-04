
import { Schema, model } from "mongoose";
import { PocketSchema } from "./PocketModel";
import { FitSchema } from "./FitModel";
import { CollarSchema } from "./CollarModel";
import { CuffSchema } from "./CuffModel";
import { PlacketSchema } from "./PlacketModel";
import { BottomSchema } from "./BottomModel";
import { BackSchema } from "./BackModel";
import { SleeveSchema } from "./SleeveModel";
import { MonogramSchema } from "./MonogramModel";
import { FabricSchema } from "./FabricModel";
import { ColorSchema } from "./ColorModel";

export const ShirtSchema = new Schema(
  {
    fit: [
      {
        type: FitSchema,
        required: true,
      },
    ],
    pocket: [
      {
        type: PocketSchema,
        required: true,
      },
    ],
    placket: [
      {
        type: PlacketSchema,
        required: true,
      },
    ],
    bottom: [
      {
        type: BottomSchema,
        required: true,
      },
    ],
    back: [
      {
        type: BackSchema,
        required: true,
      },
    ],
    sleeves: [
      {
        type: SleeveSchema,
        required: true,
      },
    ],
    monogram: [
      {
        type: MonogramSchema,
        required: false, // Optional
      },
    ],
    collar: [
      {
        type: CollarSchema,
        required: true,
      },
    ],
    cuff: [
      {
        type: CuffSchema,
        required: true,
      },
    ],
    fabric: [
      {
        type: FabricSchema,
        required: true,
      },
    ],
    color: [
      {
        type: ColorSchema,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

interface Shirt {
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
const ShirtModel = mongoose.models.Shirt || mongoose.model<Shirt>("Shirt", ShirtSchema);

export default ShirtModel;

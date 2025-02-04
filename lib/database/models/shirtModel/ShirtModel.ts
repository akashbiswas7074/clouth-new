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

export default model("Shirt", ShirtSchema);

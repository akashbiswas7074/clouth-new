import mongoose, { Schema, Document } from "mongoose";

export interface Sleeve extends Document {
  name: string;
  image: {
    url: string;
    public_id: string;
  };
  price: number;
  icon: {
    url: string;
    public_id: string;
  };
  fabricId: mongoose.Types.ObjectId;
  colorId: mongoose.Types.ObjectId;
}

export const SleeveSchema = new Schema<Sleeve>({
  name: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  price: { type: Number, required: true },
  icon: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
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

const SleeveModel =
  mongoose.models.Sleeve || mongoose.model<Sleeve>("Sleeve", SleeveSchema);

export default SleeveModel;

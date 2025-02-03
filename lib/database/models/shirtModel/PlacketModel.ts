import mongoose, { Schema, Document } from "mongoose";

export interface Placket extends Document {
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

export const PlacketSchema = new Schema<Placket>({
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

const PlacketModel =
  mongoose.models.Placket || mongoose.model<Placket>("Placket", PlacketSchema);

export default PlacketModel;

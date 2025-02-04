import mongoose, { Schema, Document } from "mongoose";

export interface Pocket extends Document {
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

export const PocketSchema = new Schema<Pocket>({
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

// Optionally, you can still create the model if needed:
const PocketModel =
  mongoose.models.Pocket || mongoose.model<Pocket>("Pocket", PocketSchema);

export default PocketModel;

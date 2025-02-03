import mongoose, { Schema, Document } from "mongoose";

export interface Back extends Document {
  name: string;
  image: {
    url: string;
    public_id: string;
  };
  icon: {
    url: string;
    public_id: string;
  };
  price: number;
  fabricId: mongoose.Types.ObjectId; // Reference to the Fabric model
  colorId: mongoose.Types.ObjectId; // Reference to the Fabric model
}

export const BackSchema = new Schema<Back>({
  name: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  icon: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  price: { type: Number, required: true },
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

const BackModel =
  mongoose.models.Back || mongoose.model<Back>("Back", BackSchema);

export default BackModel;

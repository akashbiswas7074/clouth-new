import mongoose, { Schema, Document } from "mongoose";

export interface Color extends Document {
  name: string;
  hexCode: string;
  fabricId: mongoose.Schema.Types.ObjectId; // Reference to Fabric model
  image: {
    url: string;
    public_id: string;
  };
}

export const ColorSchema = new Schema<Color>({
  name: { type: String, required: true },
  hexCode: { type: String, required: true },
  fabricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric",
    required: true,
  }, // Link to Fabric model
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});

// Check if the model already exists in mongoose.models to prevent overwriting it
const ColorModel =
  mongoose.models.Color || mongoose.model<Color>("Color", ColorSchema);

export default ColorModel;

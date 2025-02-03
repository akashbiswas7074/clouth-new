import mongoose, { Schema, Document } from "mongoose";

export interface Fabric extends Document {
  fabricName: string;
  image: {
    url: string;
    public_id: string;
  };
}

export const FabricSchema = new Schema<Fabric>({
  fabricName: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});

// Check if the model already exists in mongoose.models to prevent overwriting it
const FabricModel =
  mongoose.models.Fabric || mongoose.model<Fabric>("Fabric", FabricSchema);

export default FabricModel;

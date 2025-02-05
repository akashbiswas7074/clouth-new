import mongoose, { Schema, Document } from "mongoose";

// Define the MonogramUser schema
export interface MonogramUser extends Document {
  style: {
    name: string;
    price: number;
  };
  position: {
    name: string;
    price: number;
  };
  text: string;
  color: string;
}

export const MonogramUserSchema = new Schema<MonogramUser>({
  style: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  position: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  text: { type: String, required: false },
  color: { type: String, required: false },
});

const MonogramUserModel =
  mongoose.models.MonogramUser ||
  mongoose.model<MonogramUser>("MonogramUser", MonogramUserSchema);

export default MonogramUserModel;

import mongoose, { Schema, Document } from "mongoose";

export interface Cuff extends Document {
  style?: {
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
  };
  cufflinks?: {
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
  };
  fabricId: mongoose.Types.ObjectId;
  colorId: mongoose.Types.ObjectId;
}

export const CuffSchema = new Schema<Cuff>({
  style: {
    type: {
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
    },
    required: false,
    default: undefined,
  },
  cufflinks: {
    type: {
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
    },
    required: false,
    default: undefined,
  },
  fabricId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fabric",
    required: true,
  },
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  }, // Updated field name
});

const CuffModel =
  mongoose.models.Cuff || mongoose.model<Cuff>("Cuff", CuffSchema);

export default CuffModel;

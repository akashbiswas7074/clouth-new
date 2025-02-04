import mongoose, { Schema, Document } from "mongoose";

export interface Measurements extends Document {
  unit: string;
  neck: number;
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeve_length: number;
  elbow_width: number;
  forearm_width: number;
  wrist_cuff: number;
  bicep: number;
  shirt_length: number;
  armhole: number;
}

export const MeasurementsSchema = new Schema<Measurements>({
  unit: { type: String, required: true },
  neck: { type: Number, required: true },
  chest: { type: Number, required: true },
  waist: { type: Number, required: true },
  hips: { type: Number, required: true },
  shoulder: { type: Number, required: true },
  sleeve_length: { type: Number, required: true },
  elbow_width: { type: Number, required: true },
  forearm_width: { type: Number, required: true },
  wrist_cuff: { type: Number, required: true },
  bicep: { type: Number, required: true },
  shirt_length: { type: Number, required: true },
  armhole: { type: Number, required: true },
});

export default MeasurementsSchema;

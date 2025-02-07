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
  unit: { type: String },
  neck: { type: Number },
  chest: { type: Number },
  waist: { type: Number },
  hips: { type: Number },
  shoulder: { type: Number },
  sleeve_length: { type: Number },
  elbow_width: { type: Number },
  forearm_width: { type: Number },
  wrist_cuff: { type: Number },
  bicep: { type: Number },
  shirt_length: { type: Number },
  armhole: { type: Number },
});

export default MeasurementsSchema;

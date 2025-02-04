import { Schema, model, models } from "mongoose";
const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName : {
      type : String, 
      required : true,
    },
    lastName : {
      type : String,
      required : true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    defaultPaymentMethod: {
      type: String,
      default: "",
    },
    phoneNumber : {
      type : String,
      default : ""
    },
    image : {
      type : String,
      default : "",
    },
    whatsapp : {
      type : String,
      default : ""
    },
    zipCode : {
      type : String,
      default : ""
    },
    country : {
      type : String,
      default : ""
    },
    address: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
const User = models?.User || model("User", UserSchema);
export default User;

import mongoose from "mongoose";

const userVerificationAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    uniqueString: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    exprisesAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserVerificationAccount = mongoose.model(
  "UserVerificationAccount",
  userVerificationAccountSchema
);

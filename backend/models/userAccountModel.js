import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserAccount = mongoose.model("UserAccount", userAccountSchema);

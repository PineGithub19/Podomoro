import mongoose from "mongoose";

const userForgotPasswordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  resetString: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const UserForgotPassword = mongoose.model(
  "UserForgotPassword",
  userForgotPasswordSchema
);

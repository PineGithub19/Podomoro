import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    current: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const Tag = mongoose.model("tag", tagSchema);

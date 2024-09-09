import mongoose from "mongoose";

const treeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const myTreeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    treeId: {
      type: String,
      required: true,
    },
    buy: {
      type: Boolean,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const Tree = mongoose.model("tree", treeSchema);
export const MyTree = mongoose.model("myTree", myTreeSchema);

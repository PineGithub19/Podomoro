import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  coin: {
    type: Number,
    require: true,
  },
});

export const Coin = mongoose.model("coin", coinSchema);

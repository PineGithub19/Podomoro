import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    coin: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const myMusicSchema = new mongoose.Schema(
  {
    musicId: {
      type: String,
      required: true,
    },
    buy: {
      type: Boolean,
      required: true,
    },
    current: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Music = mongoose.model("music", musicSchema);
export const MyMusic = mongoose.model("myMusic", myMusicSchema);

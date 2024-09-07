import mongoose from "mongoose";

const plantingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    treeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Planting = mongoose.model("planting", plantingSchema);

/**
 * userId: A unique identifier for the user who started the planting session.
 * duration: The actual duration of the session in seconds.
 * start: The timestamp when the user started the timer.
 * end: The timestamp when the timer ended (either completed or canceled).
 * status: The current status of the planting session (e.g., "running", "completed", "canceled").
 * tag: The selected tag for the planting session (e.g., "Study", "Rest", "Entertainment", "Other").
 * treeId: The unique identifier for the tree being planted.
 */

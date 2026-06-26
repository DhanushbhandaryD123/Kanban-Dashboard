import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    accent: { type: String, default: "#6366F1" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Column = mongoose.model("Column", columnSchema);

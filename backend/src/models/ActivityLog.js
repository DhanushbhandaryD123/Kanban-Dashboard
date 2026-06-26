import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model("ActivityLog", activitySchema);

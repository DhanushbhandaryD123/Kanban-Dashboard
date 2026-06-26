import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema(
  { text: String, done: { type: Boolean, default: false } },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    column: { type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true },
    order: { type: Number, default: 0 },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    labels: [{ name: String, color: String }],
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },
    coverImage: { type: String, default: "" },
    checklist: [checklistItemSchema],
    estimateHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 },
    attachments: [{ name: String, url: String }],
    commentsCount: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

taskSchema.virtual("progress").get(function () {
  if (!this.checklist?.length) return 0;
  const done = this.checklist.filter((c) => c.done).length;
  return Math.round((done / this.checklist.length) * 100);
});

taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

export const Task = mongoose.model("Task", taskSchema);

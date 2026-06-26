import { Column } from "../models/Column.js";
import { Task } from "../models/Task.js";
import { assertBoardAccess, boardIdFromColumn } from "../utils/boardAccess.js";

// POST /api/columns
export const createColumn = async (req, res) => {
  const { title, board, accent } = req.body;
  const { error, message } = await assertBoardAccess(board, req.user._id);
  if (error) return res.status(error).json({ message });

  const count = await Column.countDocuments({ board });
  const column = await Column.create({ title, board, accent, order: count });
  res.status(201).json(column);
};

// PATCH /api/columns/:id
export const updateColumn = async (req, res) => {
  const { boardId, error: colErr, message: colMsg } = await boardIdFromColumn(req.params.id);
  if (colErr) return res.status(colErr).json({ message: colMsg });

  const { error, message } = await assertBoardAccess(boardId, req.user._id);
  if (error) return res.status(error).json({ message });

  const column = await Column.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(column);
};

// DELETE /api/columns/:id
export const deleteColumn = async (req, res) => {
  const { boardId, error: colErr, message: colMsg } = await boardIdFromColumn(req.params.id);
  if (colErr) return res.status(colErr).json({ message: colMsg });

  const { error, message } = await assertBoardAccess(boardId, req.user._id);
  if (error) return res.status(error).json({ message });

  await Task.deleteMany({ column: req.params.id });
  await Column.findByIdAndDelete(req.params.id);
  res.json({ message: "Column removed" });
};

// PATCH /api/columns/reorder  body: { order: [columnId, ...] }
export const reorderColumns = async (req, res) => {
  const { order } = req.body;
  if (!order?.length) return res.status(400).json({ message: "order is required" });

  const { boardId, error: colErr, message: colMsg } = await boardIdFromColumn(order[0]);
  if (colErr) return res.status(colErr).json({ message: colMsg });

  const { error, message } = await assertBoardAccess(boardId, req.user._id);
  if (error) return res.status(error).json({ message });

  await Promise.all(order.map((id, i) => Column.findByIdAndUpdate(id, { order: i })));
  res.json({ message: "Reordered" });
};

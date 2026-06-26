import { Task } from "../models/Task.js";
import { assertBoardAccess, boardIdFromTask } from "../utils/boardAccess.js";

// POST /api/tasks
export const createTask = async (req, res) => {
  const {
    title,
    description,
    board,
    column,
    priority,
    labels,
    assignees,
    dueDate,
    coverImage,
    checklist,
    estimateHours,
    loggedHours,
    attachments,
  } = req.body;

  if (!title || !board || !column) {
    return res.status(400).json({
      success: false,
      message: "Title, board and column are required.",
    });
  }

  const { error, message } = await assertBoardAccess(board, req.user._id);
  if (error) return res.status(error).json({ success: false, message });

  const count = await Task.countDocuments({ column, archived: false });

  const task = await Task.create({
    title,
    description: description || "",
    board,
    column,
    order: count,
    priority: priority || "medium",
    labels: labels || [],
    assignees: assignees || [],
    dueDate: dueDate || null,
    coverImage: coverImage || "",
    checklist: checklist || [],
    estimateHours: estimateHours || 0,
    loggedHours: loggedHours || 0,
    attachments: attachments || [],
    commentsCount: 0,
    archived: false,
  });

  const populatedTask = await Task.findById(task._id).populate("assignees", "name avatar");

  return res.status(201).json({
    success: true,
    message: "Task created successfully.",
    task: populatedTask,
  });
};

// PATCH /api/tasks/:id
export const updateTask = async (req, res) => {
  const { boardId, error: taskErr, message: taskMsg } = await boardIdFromTask(req.params.id);
  if (taskErr) return res.status(taskErr).json({ success: false, message: taskMsg });

  const { error, message } = await assertBoardAccess(boardId, req.user._id);
  if (error) return res.status(error).json({ success: false, message });

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("assignees", "name avatar");

  return res.json({
    success: true,
    message: "Task updated successfully.",
    task,
  });
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  const { boardId, error: taskErr, message: taskMsg } = await boardIdFromTask(req.params.id);
  if (taskErr) return res.status(taskErr).json({ success: false, message: taskMsg });

  const { error, message } = await assertBoardAccess(boardId, req.user._id);
  if (error) return res.status(error).json({ success: false, message });

  await Task.findByIdAndDelete(req.params.id);

  return res.json({ success: true, message: "Task deleted successfully." });
};

// PATCH /api/tasks/move
export const moveTask = async (req, res) => {
  const { taskId, toColumn, orderedIds } = req.body;

  const { boardId, error: taskErr, message: taskMsg } = await boardIdFromTask(taskId);
  if (taskErr) return res.status(taskErr).json({ success: false, message: taskMsg });

  const { error, message } = await assertBoardAccess(boardId, req.user._id);
  if (error) return res.status(error).json({ success: false, message });

  await Task.findByIdAndUpdate(taskId, { column: toColumn });

  await Promise.all(
    orderedIds.map((id, index) => Task.findByIdAndUpdate(id, { order: index }))
  );

  return res.json({ success: true, message: "Task moved successfully." });
};

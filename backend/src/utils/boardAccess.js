import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Task } from "../models/Task.js";

export const assertBoardAccess = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) return { error: 404, message: "Board not found" };
  const uid = userId.toString();
  const hasAccess =
    board.owner.toString() === uid ||
    board.members.some((m) => m.toString() === uid);
  if (!hasAccess) return { error: 403, message: "Forbidden" };
  return { board };
};

export const boardIdFromColumn = async (columnId) => {
  const col = await Column.findById(columnId).select("board");
  if (!col) return { error: 404, message: "Column not found" };
  return { boardId: col.board };
};

export const boardIdFromTask = async (taskId) => {
  const task = await Task.findById(taskId).select("board");
  if (!task) return { error: 404, message: "Task not found" };
  return { boardId: task.board };
};

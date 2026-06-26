import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Task } from "../models/Task.js";
import { assertBoardAccess } from "../utils/boardAccess.js";

const DEFAULT_COLUMNS = [
  { title: "To Do", accent: "#6366F1" },
  { title: "In Progress", accent: "#F59E0B" },
  { title: "Review", accent: "#A855F7" },
  { title: "Done", accent: "#22C55E" },
];

// GET /api/boards
export const listBoards = async (req, res) => {
  const boards = await Board.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
    archived: false,
  }).sort("-updatedAt");
  res.json(boards);
};

// POST /api/boards
export const createBoard = async (req, res) => {
  const { title, description, color, icon } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const board = await Board.create({
    title,
    description,
    color,
    icon,
    owner: req.user._id,
    members: [req.user._id],
  });

  await Column.insertMany(
    DEFAULT_COLUMNS.map((c, i) => ({ ...c, board: board._id, order: i }))
  );

  res.status(201).json(board);
};

// GET /api/boards/:id  -> board + columns + tasks
export const getBoard = async (req, res) => {
  const { error, message } = await assertBoardAccess(req.params.id, req.user._id);
  if (error) return res.status(error).json({ message });

  const board = await Board.findById(req.params.id).populate("members", "name email avatar");
  const columns = await Column.find({ board: board._id }).sort("order");
  const tasks = await Task.find({ board: board._id, archived: false })
    .populate("assignees", "name avatar")
    .sort("order");

  res.json({ board, columns, tasks });
};

// PATCH /api/boards/:id
export const updateBoard = async (req, res) => {
  const { error, message } = await assertBoardAccess(req.params.id, req.user._id);
  if (error) return res.status(error).json({ message });

  const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(board);
};

// DELETE /api/boards/:id
export const deleteBoard = async (req, res) => {
  const { error, message } = await assertBoardAccess(req.params.id, req.user._id);
  if (error) return res.status(error).json({ message });

  await Promise.all([
    Task.deleteMany({ board: req.params.id }),
    Column.deleteMany({ board: req.params.id }),
    Board.findByIdAndDelete(req.params.id),
  ]);
  res.json({ message: "Board removed" });
};

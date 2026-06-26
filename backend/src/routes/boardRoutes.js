import { Router } from "express";
import {
  listBoards, createBoard, getBoard, updateBoard, deleteBoard,
} from "../controllers/boardController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.route("/").get(listBoards).post(createBoard);
router.route("/:id").get(getBoard).patch(updateBoard).delete(deleteBoard);

export default router;

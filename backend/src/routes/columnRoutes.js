import { Router } from "express";
import {
  createColumn, updateColumn, deleteColumn, reorderColumns,
} from "../controllers/columnController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.post("/", createColumn);
router.patch("/reorder", reorderColumns);
router.route("/:id").patch(updateColumn).delete(deleteColumn);

export default router;

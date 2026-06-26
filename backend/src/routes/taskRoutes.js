import { Router } from "express";
import { createTask, updateTask, deleteTask, moveTask } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.post("/", createTask);
router.patch("/move", moveTask);
router.route("/:id").patch(updateTask).delete(deleteTask);

export default router;

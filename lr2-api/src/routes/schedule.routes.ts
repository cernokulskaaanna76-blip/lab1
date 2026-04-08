import { Router } from "express";
import { scheduleController } from "../controllers/schedule.controller";

const router = Router();

router.get("/", scheduleController.getAll);
router.get("/:id", scheduleController.getById);
router.post("/", scheduleController.create);
router.put("/:id", scheduleController.update);
router.patch("/:id", scheduleController.patch);
router.delete("/:id", scheduleController.delete);

export default router;
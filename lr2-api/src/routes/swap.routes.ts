import { Router } from "express";
import { swapController } from "../controllers/swap.controller";

const router = Router();

router.get("/", swapController.getAll);
router.get("/:id", swapController.getById);
router.post("/", swapController.create);
router.put("/:id", swapController.update);
router.patch("/:id", swapController.patch);
router.delete("/:id", swapController.delete);

export default router;
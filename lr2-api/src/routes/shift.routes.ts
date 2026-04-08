import { Router } from "express";
import { shiftController } from "../controllers/shift.controller";

const router = Router();

router.get("/", shiftController.getAll);
router.get("/with-relations/all", shiftController.getAllWithRelations);
router.get("/:id", shiftController.getById);
router.post("/", shiftController.create);
router.put("/:id", shiftController.update);
router.patch("/:id", shiftController.patch);
router.delete("/:id", shiftController.delete);

export default router;
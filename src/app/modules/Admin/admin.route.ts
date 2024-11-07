import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/", adminController.getAllAdmin);
router.get("/:id", adminController.getSingleAdmin);
router.patch("/:id", adminController.updateSingleAdmin);
router.delete("/:id", adminController.deleteSingleAdmin);
router.delete("/soft/:id", adminController.softDeleteSingleAdmin);

export const adminRoutes = router;

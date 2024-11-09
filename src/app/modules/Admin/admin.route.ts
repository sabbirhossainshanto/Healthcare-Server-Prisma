import { Router } from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";

const router = Router();

router.get("/", adminController.getAllAdmin);
router.get("/:id", adminController.getSingleAdmin);
router.patch(
  "/:id",
  validateRequest(adminValidation.updateAdminValidationSchema),
  adminController.updateSingleAdmin
);
router.delete("/:id", adminController.deleteSingleAdmin);
router.delete("/soft/:id", adminController.softDeleteSingleAdmin);

export const adminRoutes = router;

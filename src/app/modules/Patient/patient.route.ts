import { Router } from "express";
import { patientController } from "./patient.controller";

const router = Router();
router.get("/", patientController.getAllFromDB);
router.get("/:id", patientController.getByIdFromDB);
router.patch("/:id", patientController.updateIntoDB);
router.delete("/:id", patientController.deleteFromDB);
router.delete("/soft/:id", patientController.softDelete);
export const patientRoutes = router;

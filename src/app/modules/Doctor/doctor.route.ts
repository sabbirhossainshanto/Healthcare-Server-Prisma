import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

// task 3
router.get("/", doctorController.getAllFromDB);

//task 4
router.get("/:id", doctorController.getByIdFromDB);

router.patch("/:doctorId", doctorController.updateDoctor);

//task 5
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorController.deleteFromDB
);

// task 6
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorController.softDelete
);

export const doctorRoutes = router;

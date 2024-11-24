import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { scheduleController } from "./schedule.controller";

const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), scheduleController.getAllFromDB);

/**
 * API ENDPOINT: /schedule/:id
 *
 * Get schedule data by id
 */
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  scheduleController.getByIdFromDB
);

router.post(
  "/create-schedules",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleController.insertIntoDB
);

/**
 * API ENDPOINT: /schedule/:id
 *
 * Delete schedule data by id
 */

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleController.deleteFromDB
);

export const scheduleRoutes = router;

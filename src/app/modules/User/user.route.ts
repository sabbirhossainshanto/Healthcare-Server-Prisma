import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-user",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createAdmin
);

export const userRoutes = router;

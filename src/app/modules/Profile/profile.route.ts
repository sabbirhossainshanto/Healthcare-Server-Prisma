import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { profileController } from "./profile.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import parseRequest from "../../middlewares/parseRequest";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  profileController.getMyProfile
);
router.patch(
  "/update-my-profile",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single("file"),
  parseRequest,
  profileController.updateMyProfile
);

export const profileRoutes = router;

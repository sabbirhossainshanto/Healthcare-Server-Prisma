import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import parseRequest from "../../middlewares/parseRequest";
import validateRequest from "../../middlewares/validateRequest";
import { doctorValidation } from "../Doctor/doctor.validation";
import { adminValidation } from "../Admin/admin.validation";
import { patientValidation } from "../Patient/patient.validation";
import { userValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllUser
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(adminValidation.createAdminValidationSchema),
  userController.createAdmin
);
router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(doctorValidation.createDoctorValidationSchema),
  userController.createDoctor
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(patientValidation.createPatientValidationSchema),
  userController.createPatient
);
router.patch(
  "/:userId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidation.updateUserValidation),
  userController.updateUserStatus
);

export const userRoutes = router;

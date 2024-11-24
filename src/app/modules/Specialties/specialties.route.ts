import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialtiesController } from "./specialties.controller";
import validateRequest from "../../middlewares/validateRequest";
import { specialtiesValidation } from "./specialties.validation";
import parseRequest from "../../middlewares/parseRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", specialtiesController.getAllFromDB);

router.post(
  "/create-specialties",
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(specialtiesValidation.createSpecialtiesValidation),
  specialtiesController.createSpecialties
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  specialtiesController.deleteFromDB
);

export const specialtiesRoutes = router;

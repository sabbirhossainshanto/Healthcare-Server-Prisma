import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialtiesController } from "./specialties.controller";
import validateRequest from "../../middlewares/validateRequest";
import { specialtiesValidation } from "./specialties.validation";
import parseRequest from "../../middlewares/parseRequest";

const router = Router();

router.post(
  "/create-specialties",
  fileUploader.upload.single("file"),
  parseRequest,
  validateRequest(specialtiesValidation.createSpecialtiesValidation),
  specialtiesController.createSpecialties
);

export const specialtiesRoutes = router;

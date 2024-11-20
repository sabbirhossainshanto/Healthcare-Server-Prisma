import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { IFile } from "../../interfaces/file";
import catchAsync from "../../middlewares/catchAsync";
import { specialtiesService } from "./specialties.service";

const createSpecialties = catchAsync(async (req, res) => {
  const file = req.file;
  const payload = req.body;
  const result = await specialtiesService.createSpecialtiesInToDB(
    file as IFile,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties created successfully",
    data: result,
  });
});

export const specialtiesController = {
  createSpecialties,
};

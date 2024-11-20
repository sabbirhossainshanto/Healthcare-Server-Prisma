import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorService } from "./doctor.service";

const updateDoctor = catchAsync(async (req, res) => {
  const { doctorId } = req.params;
  const result = await doctorService.updateDoctor(doctorId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});
export const doctorController = { updateDoctor };

import { userService } from "./user.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
};

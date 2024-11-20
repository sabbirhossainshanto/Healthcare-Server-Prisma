import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";
import { profileService } from "./profile.service";
import { IFile } from "../../interfaces/file";

const getMyProfile = catchAsync(async (req, res) => {
  const result = await profileService.getMyProfile(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your profile is retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const file = req.file;
  const user = req.user;
  const payload = req.body;
  const result = await profileService.updateMyProfile(
    file as IFile,
    user,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const profileController = {
  getMyProfile,
  updateMyProfile,
};

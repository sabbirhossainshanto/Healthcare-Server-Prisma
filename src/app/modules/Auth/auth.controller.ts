import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);
  const { accessToken, needPasswordChange, refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token generated successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  refreshToken,
};

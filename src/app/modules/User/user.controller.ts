import { userService } from "./user.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../middlewares/catchAsync";
import { IFile } from "../../interfaces/file";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await userService.createAdmin(
    req.file as IFile,
    admin,
    password
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req, res) => {
  const { password, doctor } = req.body;
  const result = await userService.createDoctor(
    req.file as IFile,
    doctor,
    password
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req, res) => {
  const { password, patient } = req.body;
  const result = await userService.createPatient(
    req.file as IFile,
    patient,
    password
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filterQuery = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getAllUserFromDB(filterQuery, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userService.updateUserStatus(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const userController = {
  getAllUser,
  createAdmin,
  createDoctor,
  createPatient,
  updateUserStatus,
};

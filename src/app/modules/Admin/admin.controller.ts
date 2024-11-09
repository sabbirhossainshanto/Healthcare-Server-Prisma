import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";

const getAllAdmin = catchAsync(async (req, res) => {
  const filterQuery = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await adminService.getAllAdminFromDB(filterQuery, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is retrieved successfully!",
    data: result,
  });
});
const updateSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateSingleAdminFromDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is updated successfully!",
    data: result,
  });
});

const deleteSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.deleteSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is deleted successfully!",
    data: result,
  });
});
const softDeleteSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.softDeleteSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is deleted successfully!",
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
  softDeleteSingleAdmin,
};

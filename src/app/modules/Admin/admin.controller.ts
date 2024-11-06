import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../utils/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filterQuery = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adminService.getAllAdminFromDB(filterQuery, options);
    res.status(200).json({
      success: true,
      message: "Admins are retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name,
      error,
    });
  }
};

export const adminController = {
  getAllAdmin,
};

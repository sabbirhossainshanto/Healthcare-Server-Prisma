import {
  Admin,
  UserRole,
  Doctor,
  Patient,
  Prisma,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../helpers/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { IUser } from "./user.interface";

/* Create Admin  */
const createAdmin = async (file: IFile, payload: Admin, password: string) => {
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.profilePhoto = secure_url;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const userData = {
    password: hashedPassword,
    email: payload.email,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const createAdmin = await tx.admin.create({
      data: payload,
    });
    return createAdmin;
  });
  return result;
};

const createDoctor = async (file: IFile, payload: Doctor, password: string) => {
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.profilePhoto = secure_url;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const userData = {
    password: hashedPassword,
    email: payload.email,
    role: UserRole.DOCTOR,
  };
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const createDoctor = await tx.doctor.create({
      data: payload,
    });
    return createDoctor;
  });
  return result;
};
const createPatient = async (
  file: IFile,
  payload: Patient,
  password: string
) => {
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.profilePhoto = secure_url;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const userData = {
    password: hashedPassword,
    email: payload.email,
    role: UserRole.PATIENT,
  };
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const createPatient = await tx.patient.create({
      data: payload,
    });
    return createPatient;
  });
  return result;
};

const getAllUserFromDB = async (
  query: Record<string, unknown>,
  options: any
) => {
  const { limit, skip, sortBy, sortOrder, page } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...restQueries } = query;
  const andCondition: Prisma.UserWhereInput[] = [];

  if (query?.searchTerm) {
    andCondition.push({
      OR: userSearchableFields?.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(restQueries).length > 0) {
    andCondition.push({
      AND: Object.keys(restQueries).map((key) => ({
        [key]: {
          equals: (restQueries as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = { AND: andCondition };
  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.user.count({
    where: whereCondition,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: {
      result,
    },
  };
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });
  return result;
};

export const userService = {
  getAllUserFromDB,
  createAdmin,
  createDoctor,
  createPatient,
  updateUserStatus,
};

import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../helpers/prisma";
import { IAdminQuery } from "./admin.interface";

const getAllAdminFromDB = async (query: IAdminQuery, options: any) => {
  const { limit, skip, sortBy, sortOrder, page } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...restQueries } = query;
  const andCondition: Prisma.AdminWhereInput[] = [];

  if (query?.searchTerm) {
    andCondition.push({
      OR: adminSearchableFields?.map((field) => ({
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

  andCondition.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
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
  const total = await prisma.admin.count({
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

const getSingleAdminFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};
const updateSingleAdminFromDB = async (id: string, payload: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteSingleAdminFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });
    return deletedAdmin;
  });
  return result;
};
const softDeleteSingleAdminFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: deletedAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedAdmin;
  });
  return result;
};

export const adminService = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateSingleAdminFromDB,
  deleteSingleAdminFromDB,
  softDeleteSingleAdminFromDB,
};

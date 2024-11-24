import { Doctor, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { IDoctorFilterRequest } from "./doctor.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    // Corrected specialties condition
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const updateDoctor = async (
  id: string,
  payload: Partial<
    Doctor & {
      specialties: {
        specialtiesId: string;
        isDelete?: boolean;
        isCreate?: boolean;
      }[];
    }
  >
) => {
  const { specialties, ...restDoctorData } = payload;
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found!");
  }

  await prisma.$transaction(async (tx) => {
    await prisma.doctor.update({
      where: {
        id: doctor.id,
      },
      data: restDoctorData,
    });

    if (specialties && specialties?.length > 0) {
      /*filter  Delete doctor specialties */
      const deleteSpecialties = specialties.filter((s) => s.isDelete);
      if (deleteSpecialties.length > 0) {
        for (const specialties of deleteSpecialties) {
          await prisma.doctorSpecialties.deleteMany({
            where: {
              doctorId: doctor.id,
              specialtiesId: specialties.specialtiesId,
            },
          });
        }
      }
      /*filter  update doctor specialties */
      const updateSpecialties = specialties.filter((s) => s.isCreate);
      if (updateSpecialties.length > 0) {
        for (const specialties of updateSpecialties) {
          await prisma.doctorSpecialties.createMany({
            data: {
              doctorId: doctor.id,
              specialtiesId: specialties.specialtiesId,
            },
          });
        }
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctor.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const doctorService = {
  updateDoctor,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
};

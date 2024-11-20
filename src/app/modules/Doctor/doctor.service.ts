import { Doctor } from "@prisma/client";
import prisma from "../../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

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

export const doctorService = {
  updateDoctor,
};

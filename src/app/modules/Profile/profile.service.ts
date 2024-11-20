import httpStatus from "http-status";
import prisma from "../../../helpers/prisma";
import { AppError } from "../../errors/AppError";
import { IFile } from "../../interfaces/file";
import { IUser } from "../User/user.interface";
import { UserRole, UserStatus } from "@prisma/client";
import { adminValidation } from "../Admin/admin.validation";
import { doctorValidation } from "../Doctor/doctor.validation";
import { patientValidation } from "../Patient/patient.validation";
import { fileUploader } from "../../../helpers/fileUploader";

const getMyProfile = async (user: IUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (isUserExist.status !== UserStatus.ACTIVE) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This user is ${isUserExist.status}`
    );
  }

  let foreignTableData;
  if (isUserExist.role === UserRole.SUPER_ADMIN) {
    foreignTableData = await prisma.admin.findUnique({
      where: {
        email: isUserExist.email,
      },
    });
  } else if (isUserExist.role === UserRole.ADMIN) {
    foreignTableData = await prisma.admin.findUnique({
      where: {
        email: isUserExist.email,
      },
    });
  } else if (isUserExist.role === UserRole.DOCTOR) {
    foreignTableData = await prisma.doctor.findUnique({
      where: {
        email: isUserExist.email,
      },
    });
  } else if (isUserExist.role === UserRole.PATIENT) {
    foreignTableData = await prisma.patient.findUnique({
      where: {
        email: isUserExist.email,
      },
    });
  }
  return {
    ...isUserExist,
    ...foreignTableData,
  };
};

const updateMyProfile = async (
  file: IFile,
  user: IUser,
  payload: Record<string, unknown>
) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (userData?.status !== UserStatus.ACTIVE) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This user is already ${userData?.status}`
    );
  }

  let updatedProfile;
  if (
    userData.role === UserRole.SUPER_ADMIN ||
    userData.role === UserRole.ADMIN
  ) {
    const parseAdminData =
      await adminValidation.updateAdminValidationSchema.parseAsync({
        body: payload,
      });
    if (file) {
      const { secure_url } = await fileUploader.uploadToCloudinary(file);
      parseAdminData.body.profilePhoto = secure_url;
    }

    updatedProfile = await prisma.admin.update({
      where: {
        email: userData.email,
      },
      data: parseAdminData.body,
    });
  } else if (userData.role === UserRole.DOCTOR) {
    const parseDoctorData =
      await doctorValidation.updateDoctorValidationSchema.parseAsync({
        body: payload,
      });
    if (file) {
      const { secure_url } = await fileUploader.uploadToCloudinary(file);
      parseDoctorData.body.profilePhoto = secure_url;
    }
    updatedProfile = await prisma.doctor.update({
      where: {
        email: userData.email,
      },
      data: parseDoctorData.body,
    });
  } else if (userData.role === UserRole.PATIENT) {
    const parsePatientData =
      await patientValidation.updatePatientValidationSchema.parseAsync({
        body: payload,
      });
    if (file) {
      const { secure_url } = await fileUploader.uploadToCloudinary(file);
      parsePatientData.body.profilePhoto = secure_url;
    }
    updatedProfile = await prisma.patient.update({
      where: {
        email: userData.email,
      },
      data: parsePatientData.body,
    });
  }
  return updatedProfile;
};

export const profileService = {
  getMyProfile,
  updateMyProfile,
};

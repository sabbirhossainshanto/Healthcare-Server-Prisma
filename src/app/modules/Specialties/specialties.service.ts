import { Specialties } from "@prisma/client";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../helpers/prisma";

const createSpecialtiesInToDB = async (file: IFile, payload: Specialties) => {
  if (file) {
    const { secure_url } = await fileUploader.uploadToCloudinary(file);
    payload.icon = secure_url;
  }
  console.log(payload);
  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

export const specialtiesService = {
  createSpecialtiesInToDB,
};

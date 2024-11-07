import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../helpers/prisma";

const createAdmin = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const userData = {
    password: hashedPassword,
    email: payload.admin.email,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });
    const createAdmin = await tx.admin.create({
      data: payload.admin,
    });
    return createAdmin;
  });

  return result;
};

export const userService = {
  createAdmin,
};

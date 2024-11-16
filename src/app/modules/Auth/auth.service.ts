import prisma from "../../../helpers/prisma";
import bcrypt from "bcrypt";
import { jwtHelper } from "../../../helpers/jwtHelper";
import { UserStatus } from "@prisma/client";
import config from "../../../config";

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt_refresh_secret as string,
    config.jtw_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(token, "abcdefgh");
  } catch (error) {
    throw new Error("You are not authorized!");
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });
  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const authService = {
  loginUser,
  refreshToken,
};

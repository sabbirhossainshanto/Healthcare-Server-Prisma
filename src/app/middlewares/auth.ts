import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../../helpers/jwtHelper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      const verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt_access_secret as Secret
      );
      if (roles?.length > 0 && !roles.includes(verifiedUser?.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

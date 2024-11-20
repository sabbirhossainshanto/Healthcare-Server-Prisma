import { UserRole } from "@prisma/client";

export interface IUser {
  email: string;
  role:
    | typeof UserRole.SUPER_ADMIN
    | typeof UserRole.ADMIN
    | typeof UserRole.DOCTOR
    | typeof UserRole.PATIENT;
  iat: number;
  exp: number;
}

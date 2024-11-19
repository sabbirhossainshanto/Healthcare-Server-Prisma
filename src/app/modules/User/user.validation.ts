import { UserStatus } from "@prisma/client";
import { z } from "zod";

const updateUserValidation = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

export const userValidation = {
  updateUserValidation,
};

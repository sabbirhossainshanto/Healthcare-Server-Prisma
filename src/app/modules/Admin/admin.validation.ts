import { z } from "zod";

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "password is required!" }),
    admin: z.object({
      name: z.string({ required_error: "name is required!" }),
      email: z.string({ required_error: "email is required!" }),
      contactNumber: z.string({ required_error: "contactNumber is required!" }),
    }),
  }),
});

const updateAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const adminValidation = {
  updateAdminValidationSchema,
  createAdminValidationSchema,
};

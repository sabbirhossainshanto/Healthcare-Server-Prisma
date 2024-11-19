import { z } from "zod";

const createPatientValidationSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is required!" }),
    patient: z.object({
      name: z.string({ required_error: "Name is required!" }),
      email: z
        .string({ required_error: "Email is required!" })
        .email("Invalid email format!"),
      contactNumber: z
        .string({ required_error: "Contact number is required!" })
        .min(10, "Contact number must be at least 10 digits long!")
        .max(15, "Contact number must not exceed 15 digits!"),
      address: z.string().optional(),
    }),
  }),
});

export const patientValidation = {
  createPatientValidationSchema,
};

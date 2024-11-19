import { Gender } from "@prisma/client";
import { z } from "zod";

const createDoctorValidationSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is required!" }),
    doctor: z.object({
      name: z.string({ required_error: "Name is required!" }),
      email: z
        .string({ required_error: "Email is required!" })
        .email("Invalid email format!"),
      contactNumber: z
        .string({ required_error: "Contact number is required!" })
        .min(10, "Contact number must be at least 10 digits long!")
        .max(15, "Contact number must not exceed 15 digits!"),
      address: z.string().optional(),
      registrationNumber: z
        .number({ required_error: "Registration number is required!" })
        .int("Registration number must be an integer!"),
      experience: z
        .number()
        .int("Experience must be an integer!")
        .min(0, "Experience cannot be negative!")
        .default(0),
      gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
        required_error: "Gender is required!",
      }),
      appointmentFee: z
        .number({ required_error: "Appointment fee is required!" })
        .positive("Appointment fee must be a positive number!"),
      qualification: z.string({ required_error: "Qualification is required!" }),
      currentWorkingPlace: z.string({
        required_error: "Current working place is required!",
      }),
      designation: z.string({ required_error: "Designation is required!" }),
    }),
  }),
});

export const doctorValidation = {
  createDoctorValidationSchema,
};

import { z } from "zod";

const createSpecialtiesValidation = z.object({
  body: z.object({
    title: z.string({ required_error: "title is required" }),
    icon: z.string({ required_error: "title is required" }).optional(),
  }),
});

export const specialtiesValidation = {
  createSpecialtiesValidation,
};

import { z } from "zod";

const nameValidation = z
    .string()
    .trim()
    .regex(/^[A-Z][a-z]*$/, {
        message:
            "Name must start with an uppercase letter and contain only letters",
    })
    .max(20, { message: "Name cannot be more than 20 characters" });
// User name validation schema
export const userNameValidationSchema = z.object({
    firstName: nameValidation,
    middleName: nameValidation, // Optional middle name
    lastName: nameValidation,
});

export const updateNameValidation = z
    .object({
        firstName: z
            .string()
            .trim()
            .regex(/^[A-Z][a-z]*$/, {
                message: "Name must start with an uppercase letter and contain only letters",
            })
            .max(20, { message: "Name cannot be more than 20 characters" })
            .optional(),
        middleName: z
            .string()
            .trim()
            .regex(/^[A-Z][a-z]*$/, {
                message: "Name must start with an uppercase letter and contain only letters",
            })
            .max(20, { message: "Name cannot be more than 20 characters" })
            .optional(),
        lastName: z
            .string()
            .trim()
            .regex(/^[A-Z][a-z]*$/, {
                message: "Name must start with an uppercase letter and contain only letters",
            })
            .max(20, { message: "Name cannot be more than 20 characters" })
            .optional(),
    })
    .partial();
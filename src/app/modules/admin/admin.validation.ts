
import { z } from "zod";
import { updateNameValidation, userNameValidationSchema } from "../../validation/user.validation";



// Admin validation schema
const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is Required" }).max(20),
    admin: z.object({
      name: userNameValidationSchema,
      gender: z.enum(["male", "female", "other"], {
        required_error: "Gender is Required",
        invalid_type_error: "Gender must be one of [male, female, other]",
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string({ required_error: "Email is Required" })
        .email({ message: "Email is not in valid email format" }),
      presentAddress: z.string({ required_error: "Present Address is Required" }),
      permanentAddress: z.string({
        required_error: "Permanent Address is Required",
      }),
      contact: z.string({ required_error: "Contact Number is Required" }),
      emergencyContact: z.string({
        required_error: "Emergency Contact is Required",
      }),
      profileImage: z.string().url().optional(),
    })
  })
})

const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z
      .object({
        name: updateNameValidation.optional(),
        gender: z
          .enum(["male", "female", "other"], {
            invalid_type_error: "Gender must be one of [male, female, other]",
          })
          .optional(),
        dateOfBirth: z.string().optional(),
        email: z
          .string()
          .email({ message: "Email is not in valid email format" })
          .optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        contact: z.string().optional(),
        emergencyContact: z.string().optional(),
        profileImage: z.string().url().optional(),
      })
      .partial()
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  }),
});

export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema
};

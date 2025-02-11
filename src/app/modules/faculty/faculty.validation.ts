
import { z } from "zod";
import { updateNameValidation, userNameValidationSchema } from "../../validation/user.validation";



// Faculty validation schema
const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is Required" }).max(20),
    faculty: z.object({
      name: userNameValidationSchema,
      gender: z.enum(["male", "female", "other"], {
        required_error: "Gender is Required",
        invalid_type_error: "Gender must be one of [male, female, other]",
      }),
      designation: z.string({ required_error: 'Designation is Required', invalid_type_error: 'Designation must be string' }),
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
      managementDepartment: z.string(),
    })
  })
})

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z
      .object({
        name: updateNameValidation.optional(),
        gender: z
          .enum(["male", "female", "other"], {
            invalid_type_error: "Gender must be one of [male, female, other]",
          })
          .optional(),
        designation: z.string({ invalid_type_error: 'Designation must be string' }).optional(),
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
        managementDepartment: z.string().optional(),
      })
      .partial()
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  }),
});

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema
};

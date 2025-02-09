
import { z } from "zod";

// Name validation
const nameValidation = z
  .string()
  .trim()
  .regex(/^[A-Z][a-z]*$/, {
    message:
      "Name must start with an uppercase letter and contain only letters",
  })
  .max(20, { message: "Name cannot be more than 20 characters" });
// User name validation schema
const userNameValidationSchema = z.object({
  firstName: nameValidation,
  middleName: nameValidation, // Optional middle name
  lastName: nameValidation,
});

// Guardian validation schema
const guardianValidationSchema = z.object({
  fatherName: z.string({ required_error: "Father Name is Required" }),
  fatherOccupation: z.string({
    required_error: "Father Occupation is Required",
  }),
  fatherContact: z.string({ required_error: "Father Contact is Required" }),
  motherName: z.string({ required_error: "Mother Name is Required" }),
  motherOccupation: z.string({
    required_error: "Mother Occupation is Required",
  }),
  motherContact: z.string({ required_error: "Mother Contact is Required" }),
});

// Local guardian validation schema
const localGuardianValidationSchema = z.object({
  name: z.string({ required_error: "Local Guardian Name is Required" }),
  occupation: z.string({
    required_error: "Local Guardian Occupation is Required",
  }),
  contactNo: z.string({ required_error: "Local Guardian Contact is Required" }),
  address: z.string({ required_error: "Local Guardian Address is Required" }),
});


const updateNameValidation = z
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

const updateGuardianValidation = z
  .object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContact: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContact: z.string(),
  })
  .partial();

const updateLocalGuardianValidation = z
  .object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
  })
  .partial();

// Student validation schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is Required" }).max(20),
    student: z.object({
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
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      profileImage: z.string().url().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    })
  })
})

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z
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
        guardian: updateGuardianValidation.optional(),
        localGuardian: updateLocalGuardianValidation.optional(),
        bloodGroup: z
          .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
          .optional(),
        profileImage: z.string().url().optional(),
        admissionSemester: z.string().optional(),
        academicDepartment: z.string().optional(),
      })
      .partial()
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema
};

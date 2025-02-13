import { z } from "zod";
import { Types } from "mongoose";

// Zod schema for PreRequisiteCourses
export const preRequisiteCoursesValidationSchema = z.object({
    course: z.string({ invalid_type_error: "Course is Invalid" }),
    isDeleted: z.boolean().optional().default(false)
});

// Zod schema for Course
export const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "Title is required" })
            .trim()
            .min(1, { message: "Title is required" })
            .max(255, { message: "Title must be at most 255 characters" }),
        prefix: z.string({ required_error: "Prefix is required" })
            .trim()
            .min(1, { message: "Prefix is required" })
            .max(50, { message: "Prefix must be at most 50 characters" }),
        code: z.number({ required_error: "Code is required", invalid_type_error: "Code must be a number" })
            .int({ message: "Code must be an integer" })
            .positive({ message: "Code must be a positive number" }),
        credits: z.number({ required_error: "Credits are required", invalid_type_error: "Credits must be a number" })
            .int({ message: "Credits must be an integer" })
            .positive({ message: "Credits must be a positive number" }),
        preRequisiteCourses: z.array(preRequisiteCoursesValidationSchema).optional(),
        isDeleted: z.boolean().optional()
    })
});
export const updateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string()
            .trim()
            .max(255, { message: "Title must be at most 255 characters" })
            .optional(),
        prefix: z.string()
            .trim()
            .max(50, { message: "Prefix must be at most 50 characters" })
            .optional(),
        code: z.number({ invalid_type_error: "Code must be a number" })
            .int({ message: "Code must be an integer" })
            .positive({ message: "Code must be a positive number" })
            .optional(),
        credits: z.number({ invalid_type_error: "Credits must be a number" })
            .int({ message: "Credits must be an integer" })
            .positive({ message: "Credits must be a positive number" })
            .optional(),
        preRequisiteCourses: z.array(preRequisiteCoursesValidationSchema).optional(),
        isDeleted: z.boolean().optional()
    })
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        })
})


const courseFacultiesValidationSchema = z.object({
    body: z.object({
        faculties: z.array(z.string()),
    })
})


export const CourseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
    courseFacultiesValidationSchema,
}
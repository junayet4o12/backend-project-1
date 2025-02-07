import { z } from "zod";

const createAcademicFacultyValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Academic Faculty Name is required' }),
    })
}) 
const updateAcademicFacultyValidationSchema = z.object({
    body: z.object({
        name: z.string({ invalid_type_error: 'Academic Faculty Name must be a string' }),
    }).optional()
})

export const AcademicFacultyValidation = {
    createAcademicFacultyValidationSchema,
    updateAcademicFacultyValidationSchema,
}
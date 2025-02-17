import { z } from 'zod';
import { SemesterRegistrationStatusArray } from './semesterRegistration.constant';

const createSemesterRegistrationSchema = z.object({
    body: z.object({
        academicSemester: z.string().min(1, { message: "Academic semester ID is required" }),
        status: z.enum(SemesterRegistrationStatusArray as [string, ...string[]]).default("upcoming"),
        startDate: z.string({
            required_error: "Start date is required",
        }).datetime(),
        endDate: z.string({
            required_error: "End date is required",
        }).datetime(),
        minCredit: z.number({
            required_error: "Minimum credit is required",
            invalid_type_error: "Minimum credit must be a number",
        }),
        maxCredit: z.number({
            required_error: "Maximum credit is required",
            invalid_type_error: "Maximum credit must be a number",
        }),
    }),
});
const updateSemesterRegistrationSchema = z.object({
    body: z.object({
        academicSemester: z.string().optional(),
        status: z.enum(SemesterRegistrationStatusArray as [string, ...string[]]).default("upcoming").optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        minCredit: z.number({
            invalid_type_error: "Minimum credit must be a number",
        }).optional(),
        maxCredit: z.number({
            invalid_type_error: "Maximum credit must be a number",
        }).optional(),
    })
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        })
    ,
});

export const SemesterRegistrationValidations = {
    createSemesterRegistrationSchema,
    updateSemesterRegistrationSchema,
};

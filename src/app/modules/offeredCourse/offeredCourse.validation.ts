import { z } from "zod";
import { Days } from "./offeredCourse.constant";

export const daysEnum = z.array(z.enum(Days as [string, ...string[]]));
const timeStringSchema = z.string({
    required_error: "time is required",
    invalid_type_error: "time must be a string",
}).refine((time) => {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(time)
}, {
    message: `Invalid time format, expected "HH:MM" in 24 hours format`
})

const createOfferedCourseValidationSchema = z.object({
    body: z.object({
        semesterRegistration: z.string({
            required_error: "Semester Registration ID is required",
            invalid_type_error: "Semester Registration ID must be a string",
        }),
        academicFaculty: z.string({
            required_error: "Academic Faculty ID is required",
            invalid_type_error: "Academic Faculty ID must be a string",
        }),
        academicDepartment: z.string({
            required_error: "Academic Department ID is required",
            invalid_type_error: "Academic Department ID must be a string",
        }),
        course: z.string({
            required_error: "Course ID is required",
            invalid_type_error: "Course ID must be a string",
        }),
        faculty: z.string({
            required_error: "Faculty ID is required",
            invalid_type_error: "Faculty ID must be a string",
        }),
        maxCapacity: z.number({
            required_error: "Max capacity is required",
            invalid_type_error: "Max capacity must be a number",
        }).min(1, "Max capacity must be at least 1"),
        section: z.number({
            required_error: "Section is required",
            invalid_type_error: "Section must be a number",
        }).min(1, "Section must be at least 1"),
        days: daysEnum,
        startTime: timeStringSchema,
        endTime: timeStringSchema
    }).refine((body) => {

        const start = new Date(`1970-01-01T${body.startTime}:00`)
        const end = new Date(`1970-01-01T${body.endTime}:00`)
        return end > start
    }, {
        message: `Start time should be before end time!`
    })
});
const updateOfferedCourseValidationSchema = z.object({
    body: z.object({
        faculty: z.string({
            required_error: "Faculty ID is required",
            invalid_type_error: "Faculty ID must be a string",
        }),
        maxCapacity: z.number({
            required_error: "Max capacity is required",
            invalid_type_error: "Max capacity must be a number",
        }).min(1, "Max capacity must be at least 1"),
        section: z.number({
            required_error: "Section is required",
            invalid_type_error: "Section must be a number",
        }).min(1, "Section must be at least 1"),
        days: daysEnum,
        startTime: timeStringSchema,
        endTime: timeStringSchema
    }).refine((body) => {

        const start = new Date(`1970-01-01T${body.startTime}:00`)
        const end = new Date(`1970-01-01T${body.endTime}:00`)
        return end > start
    }, {
        message: `Start time should be before end time!`
    })
});

export const OfferedCourseValidations = {
    createOfferedCourseValidationSchema,
    updateOfferedCourseValidationSchema
}
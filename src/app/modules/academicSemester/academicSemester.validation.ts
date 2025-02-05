import { z } from "zod";
import { AcademicSemesterName, Months } from "./academicSemester.constant";
;

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterName] as [string, ...string[]], { required_error: 'Name is required', invalid_type_error: 'Name must be one of Autumn, Summer, Fall' }),
        year: z.string({ required_error: 'Year is required' }),
        startMonth: z.enum([...Months] as [string, ...string[]], { required_error: 'Start month is required', invalid_type_error: 'Start month must be one of January, February, March, April, May, June, July, August, September, October, November, December' }),
        endMonth: z.enum([...Months] as [string, ...string[]], { required_error: 'End month is required', invalid_type_error: 'End month must be one of January, February, March, April, May, June, July, August, September, October, November, December' }),
    })
})
const updateAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterName] as [string, ...string[]], { invalid_type_error: 'Name must be one of Autumn, Summer, Fall' }).optional(),
        year: z.string().optional(),
        startMonth: z.enum([...Months] as [string, ...string[]], { invalid_type_error: 'Start month must be one of January, February, March, April, May, June, July, August, September, October, November, December' }).optional(),
        endMonth: z.enum([...Months] as [string, ...string[]], { invalid_type_error: 'End month must be one of January, February, March, April, May, June, July, August, September, October, November, December' }).optional(),
    })
})

export const AcademicSemesterValidation = {
    createAcademicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema,
}
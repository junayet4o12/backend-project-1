import { z } from "zod";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.constant";
;

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterName] as [string, ...string[]], { required_error: 'Name is required', invalid_type_error: 'Name must be one of Autumn, Summer, Fall' }),
        year: z.date(),
        code: z.enum([...AcademicSemesterCode] as [string, ...string[]], { required_error: 'Code is required', invalid_type_error: 'Code must be one of 01, 02, 03' }),
        startMonth: z.enum([...Months] as [string, ...string[]], { required_error: 'Start month is required', invalid_type_error: 'Start month must be one of January, February, March, April, May, June, July, August, September, October, November, December' }),
        endMonth: z.enum([...Months] as [string, ...string[]], { required_error: 'End month is required', invalid_type_error: 'End month must be one of January, February, March, April, May, June, July, August, September, October, November, December' }),
    })
})

export const AcademicSemesterValidation = {
    createAcademicSemesterValidationSchema
}
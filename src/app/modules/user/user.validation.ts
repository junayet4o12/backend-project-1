import {z} from 'zod';

const UserValidationSchema = z.object({
    id: z.string({required_error: 'User ID is Required'}),
    password: z.string({required_error: 'Password is Required'}).max(20, {message: 'Password cannot be more than 20 characters'}),
    needsPasswordChange: z.boolean().default(true),
    role: z.enum(['admin', 'student', 'faculty'], {required_error: 'Role is Required', invalid_type_error: 'Role must be one of [admin, student, faculty]'}),
    status: z.enum(['in-progress', 'blocked'], {invalid_type_error: 'Status must be one of [in-progress, blocked]'}).default('in-progress'),
    isDeleted: z.boolean().default(false),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    deletedAt: z.string().optional(),
})
export const UserValidation = {
    UserValidationSchema
}
import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
const router = express.Router();



router.post('/create-student', auth('admin', 'superAdmin'),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(studentValidations.createStudentValidationSchema),
    UserControllers.createStudent);
router.post('/create-faculty',
    auth('admin', 'superAdmin'),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(facultyValidations.createFacultyValidationSchema), UserControllers.createFaculty)
router.post('/create-admin',
    auth('superAdmin'),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(adminValidations.createAdminValidationSchema), UserControllers.createAdmin)
router.get("/get-me", auth('student', 'faculty', 'admin', 'superAdmin'), UserControllers.getMyData)
router.post('/change-status/:id', auth('admin', 'superAdmin'), validateRequest(UserValidation.changeStatusValidationSchema), UserControllers.changeStatus)
export const UserRoutes = router;
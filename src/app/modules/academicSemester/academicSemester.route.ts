import { Router } from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidation } from "./academicSemester.validation";
import auth from "../../middlewares/auth";

const router = Router();
router.post('/create', auth('admin', 'superAdmin'), validateRequest(AcademicSemesterValidation.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester)
router.get('/', auth('admin', 'superAdmin', 'faculty', 'student'), AcademicSemesterControllers.getAllAcademicSemester)
router.get('/:id', auth('admin', 'superAdmin', 'faculty', 'student'), AcademicSemesterControllers.getSingleAcademicSemester)
router.patch('/:id', auth('admin', 'superAdmin'), validateRequest(AcademicSemesterValidation.updateAcademicSemesterValidationSchema), AcademicSemesterControllers.updateAcademicSemester)
export const AcademicSemesterRoutes = router;
import { Router } from "express";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.post('/create', auth('superAdmin'), validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:id', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:id', auth('superAdmin'), validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema), AcademicFacultyControllers.updateAcademicFaculty);

export const AcademicFacultyRoutes = router; 
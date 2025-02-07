import { Router } from "express";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";

const router = Router();

router.post('/create', validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:id', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:id', validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema), AcademicFacultyControllers.updateAcademicFaculty);

export const AcademicFacultyRoutes = router;
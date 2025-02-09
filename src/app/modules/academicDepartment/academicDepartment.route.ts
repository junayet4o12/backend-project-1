import { Router } from "express";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";

const router = Router();

router.post('/create', validateRequest(AcademicDepartmentValidation.createAcademicDepartmentValidationSchema), AcademicDepartmentControllers.createAcademicDepartment);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);

router.get('/:id', AcademicDepartmentControllers.getSingleAcademicDepartment);

router.patch('/:id', validateRequest(AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema), AcademicDepartmentControllers.updateAcademicDepartment);

export const AcademicDepartmentRoutes = router;
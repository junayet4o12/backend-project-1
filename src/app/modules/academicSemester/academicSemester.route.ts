import { Router } from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidation } from "./academicSemester.validation";

const router = Router();
router.post('/create', validateRequest(AcademicSemesterValidation.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester)
router.get('/', AcademicSemesterControllers.getAllAcademicSemester)
router.get('/:id', AcademicSemesterControllers.getSingleAcademicSemester)
router.patch('/:id', validateRequest(AcademicSemesterValidation.updateAcademicSemesterValidationSchema), AcademicSemesterControllers.updateAcademicSemester)
export const AcademicSemesterRoutes = router;
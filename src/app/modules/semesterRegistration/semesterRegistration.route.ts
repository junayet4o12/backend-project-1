import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post('/create', auth('admin', 'superAdmin'), validateRequest(SemesterRegistrationValidations.createSemesterRegistrationSchema), SemesterRegistrationControllers.createSemesterRegistration)
router.get("/", auth('admin', 'superAdmin', 'faculty', 'student'), SemesterRegistrationControllers.getAllSemesterRegistrations);
router.get("/:id", auth('admin', 'superAdmin', 'faculty', 'student'), SemesterRegistrationControllers.getSingleSemesterRegistrations);
router.patch("/:id", auth('admin', 'superAdmin'), validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationSchema), SemesterRegistrationControllers.updateSemesterRegistration)
export const SemesterRegistrationRoutes = router;

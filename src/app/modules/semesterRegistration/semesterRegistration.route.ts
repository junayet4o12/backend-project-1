import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";
const router = express.Router();

router.post('/create', validateRequest(SemesterRegistrationValidations.createSemesterRegistrationSchema), SemesterRegistrationControllers.createSemesterRegistration)
router.get("/", SemesterRegistrationControllers.getAllSemesterRegistrations);
router.get("/:id", SemesterRegistrationControllers.getSingleSemesterRegistrations);
router.patch("/:id", validateRequest(SemesterRegistrationValidations.updateSemesterRegistrationSchema), SemesterRegistrationControllers.updateSemesterRegistration)
export const SemesterRegistrationRoutes = router;

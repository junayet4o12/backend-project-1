import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyControllers } from "./faculty.controller";
import { facultyValidations } from "./faculty.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

router.get("/", auth('admin', 'superAdmin'), FacultyControllers.getAllFaculty);
router.get("/:id", auth('admin', 'superAdmin', 'faculty'), FacultyControllers.getSingleFaculty);
router.delete("/:id", auth('admin', 'superAdmin'), FacultyControllers.deleteSingleFaculty);
router.patch("/:id", auth('admin', 'superAdmin'), validateRequest(facultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFaculty)
export const FacultyRoutes = router;

import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyControllers } from "./faculty.controller";
import { facultyValidations } from "./faculty.validation";
const router = express.Router();

router.get("/", FacultyControllers.getAllFaculty);
router.get("/:facultyId", FacultyControllers.getSingleFaculty);
router.delete("/:facultyId", FacultyControllers.deleteSingleFaculty);
router.patch("/:facultyId", validateRequest(facultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFaculty)
export const FacultyRoutes = router;

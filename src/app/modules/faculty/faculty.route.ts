import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyControllers } from "./faculty.controller";
import { facultyValidations } from "./faculty.validation";
const router = express.Router();

router.get("/", FacultyControllers.getAllFaculty);
router.get("/:id", FacultyControllers.getSingleFaculty);
router.delete("/:id", FacultyControllers.deleteSingleFaculty);
router.patch("/:id", validateRequest(facultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFaculty)
export const FacultyRoutes = router;

import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

router.get("/", auth('admin', 'superAdmin', 'faculty'), StudentControllers.getAllStudent);
router.get("/:id", auth('admin', 'faculty', 'superAdmin'), StudentControllers.getSingleStudent);
router.delete("/:id", auth('admin', 'superAdmin'), StudentControllers.deleteSingleStudent);
router.patch("/:id", auth('admin', 'superAdmin'), validateRequest(studentValidations.updateStudentValidationSchema), StudentControllers.updateStudent)

export const StudentRoutes = router;

import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";
const router = express.Router();

router.get("/", StudentControllers.getAllStudent);
router.get("/:id", StudentControllers.getSingleStudent);
router.delete("/:id", StudentControllers.deleteSingleStudent);
router.patch("/:id", validateRequest(studentValidations.updateStudentValidationSchema), StudentControllers.updateStudent)
export const StudentRoutes = router;

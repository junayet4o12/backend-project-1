import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseControllers } from "./offeredCourse.controller";
import { OfferedCourseValidations } from "./offeredCourse.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post('/create', auth('admin', 'superAdmin'), validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema), OfferedCourseControllers.createOfferedCourse)
router.get('/my-offered-courses', auth('student'), OfferedCourseControllers.getMyOfferedCourse)
router.get("/", auth('admin', 'superAdmin', 'faculty'), OfferedCourseControllers.getAllOfferedCourse);
router.get("/:id", auth('admin', 'superAdmin', 'faculty', 'student'), OfferedCourseControllers.getSingleOfferedCourse);
router.patch("/:id", auth('admin', 'superAdmin'), validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema), OfferedCourseControllers.updateOfferedCourse);

export const OfferedCourseRoutes = router;

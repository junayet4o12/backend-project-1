import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post('/create', auth('student'), validateRequest(EnrolledCourseValidations.createEnrolledCourseValidationSchema), EnrolledCourseControllers.createEnrolledCourse)
router.patch('/update-marks', auth('faculty', 'admin', 'superAdmin'), validateRequest(EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema), EnrolledCourseControllers.updateEnrolledCourseMarks)
router.get('/my-enrolled-courses', auth('student'), EnrolledCourseControllers.myEnrolledCourses)
export const EnrolledCourseRoutes = router;
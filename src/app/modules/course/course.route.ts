import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseControllers } from "./course.controller";
import { CourseValidations } from "./course.validation";
const router = express.Router();

router.post('/create', validateRequest(CourseValidations.createCourseValidationSchema), CourseControllers.createCourse)
router.get("/", CourseControllers.getAllCourses);
router.get("/:id", CourseControllers.getSingleCourses);
router.delete("/:id", CourseControllers.deleteSingleCourse);
router.patch("/:id", validateRequest(CourseValidations.updateCourseValidationSchema), CourseControllers.updateCourse)
router.put('/:courseId/assign-faculties', validateRequest(CourseValidations.courseFacultiesValidationSchema),  CourseControllers.assignFacultiesWithCourse)
router.delete('/:courseId/remove-faculties', validateRequest(CourseValidations.courseFacultiesValidationSchema),  CourseControllers.removeFacultiesFromCourse)
export const CourseRoutes = router;

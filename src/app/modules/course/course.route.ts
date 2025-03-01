import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseControllers } from "./course.controller";
import { CourseValidations } from "./course.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post('/create', auth('admin', 'superAdmin'), validateRequest(CourseValidations.createCourseValidationSchema), CourseControllers.createCourse)
router.get("/", auth('admin', 'superAdmin', 'faculty', 'student'), CourseControllers.getAllCourses);
router.get("/:id", auth('admin', 'superAdmin', 'faculty', 'student'), CourseControllers.getSingleCourses);
router.delete("/:id", auth('admin', 'superAdmin'), CourseControllers.deleteSingleCourse);
router.patch("/:id", auth('admin', 'superAdmin'), validateRequest(CourseValidations.updateCourseValidationSchema), CourseControllers.updateCourse)
router.put('/:courseId/assign-faculties', auth('admin', 'superAdmin'), validateRequest(CourseValidations.courseFacultiesValidationSchema), CourseControllers.assignFacultiesWithCourse)
router.get('/:courseId/get-faculties', auth('admin', 'superAdmin', 'faculty', 'student'), CourseControllers.getCourseFaculties)
router.delete('/:courseId/remove-faculties', auth('admin', 'superAdmin'), validateRequest(CourseValidations.courseFacultiesValidationSchema), CourseControllers.removeFacultiesFromCourse)
export const CourseRoutes = router;

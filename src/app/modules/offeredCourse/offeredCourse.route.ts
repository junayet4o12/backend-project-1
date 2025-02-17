import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseControllers } from "./offeredCourse.controller";
import { OfferedCourseValidations } from "./offeredCourse.validation";
const router = express.Router();

router.post('/create', validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema), OfferedCourseControllers.createOfferedCourse)
router.get("/", OfferedCourseControllers.getAllOfferedCourse);
router.get("/:id", OfferedCourseControllers.getSingleOfferedCourse);
router.patch("/:id", validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema), OfferedCourseControllers.updateOfferedCourse)
export const OfferedCourseRoutes = router;

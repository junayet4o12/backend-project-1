import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CourseServices } from "./course.service";



const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Course Created Successfully", data: result });
})

const getAllCourses = catchAsync(async (req, res) => {


    const result = await CourseServices.getAllCoursesFromDB(req.query);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Courses data has found", meta: result.meta, data: result.result });
})

const getSingleCourses = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourseFromDB(id);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Course data has found", data: result });
})

const deleteSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseFromDB(id);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Course deleted successfully", data: result });
})

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseOfDB(id, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Course updated successfully", data: result });
})


const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty has assigned into the course", data: result });
})
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result = await CourseServices.removeFacultiesFromCourseIntoDB(courseId, faculties);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty has removed from the course", data: result });
})

const getCourseFaculties = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.getCourseFaculties(courseId);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty has Fetched", data: result });
})

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getSingleCourses,
    deleteSingleCourse,
    updateCourse,
    assignFacultiesWithCourse,
    removeFacultiesFromCourse,
    getCourseFaculties

};

import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.service";



const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "OfferedCourse has created", data: result });
})

const getAllOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(req.query);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "OfferedCourse data has found", data: result });
})

const getSingleOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "OfferedCourse data has found", data: result });
})

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await OfferedCourseServices.updateOfferedCourseOfDB(id, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "OfferedCourse updated successfully", data: result });
})

export const OfferedCourseControllers = {
    getAllOfferedCourse,
    getSingleOfferedCourse,
    updateOfferedCourse,
    createOfferedCourse
};

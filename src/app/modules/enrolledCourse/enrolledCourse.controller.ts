import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { EnrolledCourseServices } from './enrolledCourse.service';
import sendResponse from '../../utils/sendResponse';

const createEnrolledCourse = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Enrolled Course Created Successfully", data: result });
})
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const id = req.user.userId;

    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(id, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Enrolled Course Mark has updated!", data: result });
})

const myEnrolledCourses = catchAsync(async (req, res) => {
    const id = req.user.userId;

    const result = await EnrolledCourseServices.myEnrolledCourses(id, req.query);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "My enrolled course has fetched!", meta: result.meta, data: result.result });
})

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
    myEnrolledCourses
}
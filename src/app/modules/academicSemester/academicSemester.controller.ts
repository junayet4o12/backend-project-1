import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";


const createAcademicSemester = catchAsync(async (req, res) => {
    const { academicSemester: academicSemesterData } = req.body;
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(academicSemesterData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Semester created successfully", data: result });
})

export const AcademicSemesterControllers = {
    createAcademicSemester,
}

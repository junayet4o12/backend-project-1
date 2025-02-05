import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";


const createAcademicSemester = catchAsync(async (req, res) => {
    const academicSemesterData = req.body;

    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(academicSemesterData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Semester created successfully", data: result });
})
const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "All Academic Semester fetched successfully", data: result });
})
const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AcademicSemesterServices.getASingleAcademicSemesterFromDB(id);
    if (!result) {
        res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Academic Semester not found", data: null });
    }
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Semester fetched successfully", data: result });
})
const updateAcademicSemester = catchAsync(async (req, res) => {
    const { id } = req.params;
    const {code, ...academicSemesterData} = req.body;

    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(id, academicSemesterData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Semester updated successfully", data: result });
})

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester,
}

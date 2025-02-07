import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";
import httpStatus from "http-status";


const createAcademicFaculty = catchAsync(async (req, res) => {
    const academicFacultyData = req.body;

    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(academicFacultyData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Faculty created successfully", data: result });
})
const getAllAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "All Academic Faculty fetched successfully", data: result });
})
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(id);
    if (!result) {
        res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Academic Faculty not found", data: null });
    }
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Faculty fetched successfully", data: result });
})
const updateAcademicFaculty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const academicFacultyData = req.body;

    const result = await AcademicFacultyServices.updateSingleAcademicFacultyIntoDB(id, academicFacultyData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Faculty updated successfully", data: result });
})

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty,
}

import { Types } from "mongoose";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";
import httpStatus from "http-status";


const createAcademicDepartment = catchAsync(async (req, res) => {
    const academicDepartmentData = req.body;
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(academicDepartmentData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Department created successfully", data: result });
})
const getAllAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "All Academic Department fetched successfully", data: result });
})
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(id);
    if (!result) {
        res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Academic Department not found", data: null });
    }
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Department fetched successfully", data: result });
})
const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const academicDepartmentData = req.body;

    const result = await AcademicDepartmentServices.updateSingleAcademicDepartmentIntoDB(id, academicDepartmentData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic Department updated successfully", data: result });
})

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
}

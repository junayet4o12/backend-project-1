import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { SemesterRegistrationServices } from "./semesterRegistration.service";



const createSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Semester Registration Created Successfully", data: result });
})

const getAllSemesterRegistrations = catchAsync(async (req, res) => {


    const result = await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(req.query);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Semester Registrations is retrieved successfully", data: result });
})

const getSingleSemesterRegistrations = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Semester Registration data has found", data: result });
})

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SemesterRegistrationServices.updateSemesterRegistrationOfDB(id, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Semester Registration updated successfully", data: result });
})

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistrations,
    updateSemesterRegistration
};

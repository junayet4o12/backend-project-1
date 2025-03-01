import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { FacultyServices } from "./faculty.service";



const getAllFaculty = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty data has found", meta: result.meta, data: result.result });
})

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.getSingleFacultiesFromDB(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty data has found", data: result });
})

const deleteSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty deleted successfully", data: result });
})

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  

  const result = await FacultyServices.updateFacultyOfDB(id, req.body.faculty);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty updated successfully", data: result });
})

export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  deleteSingleFaculty,
  updateFaculty
};

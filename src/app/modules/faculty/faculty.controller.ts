import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { FacultyServices } from "./faculty.service";



const getAllFaculty = catchAsync(async (req, res) => {
 
  
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty data has found", data: result });
})

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultiesFromDB(facultyId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty data has found", data: result });
})

const deleteSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(facultyId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty deleted successfully", data: result });
})

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;

  const result = await FacultyServices.updateFacultyOfDB(facultyId, req.body.faculty);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty updated successfully", data: result });
})

export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  deleteSingleFaculty,
  updateFaculty
};

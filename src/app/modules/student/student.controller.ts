import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";



const getAllStudent = catchAsync(async (req, res) => {


  const result = await StudentServices.getAllStudentsFromDB(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student data has found", meta: result.meta, data: result.result });
})

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentsFromDB(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student data has found", data: result });
})

const deleteSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentFromDB(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student deleted successfully", data: result });
})

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.updateStudentOfDB(id, req.body.student);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student updated successfully", data: result });
})


export const StudentControllers = {
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent,
  updateStudent,
};

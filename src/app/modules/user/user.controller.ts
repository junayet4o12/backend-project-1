import { UserServices } from "./user.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";


const createStudent = catchAsync(async (req, res) => {
    const file = req.file

    const { password, student: studentData } = req.body;
    const result = await UserServices.createStudentIntoDB(file, password, studentData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student created successfully", data: result });
})
const createFaculty = catchAsync(async (req, res) => {
    const file = req.file
    const { password, faculty: facultyData } = req.body;
    const result = await UserServices.createFacultyIntoDB(file, password, facultyData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Faculty created successfully", data: result });
})
const createAdmin = catchAsync(async (req, res) => {
    const file = req.file
    const { password, admin: adminData } = req.body;
    const result = await UserServices.createAdminIntoDB(file, password, adminData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin created successfully", data: result });
})

const getMyData = catchAsync(async (req, res) => {
    const { userId, role } = req.user

    const result = await UserServices.getMyData(userId, role);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "My data has found!", data: result });
})

const changeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await UserServices.changeStatus(id, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: `User has ${result?.status}`, data: result });
})

export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMyData,
    changeStatus
}

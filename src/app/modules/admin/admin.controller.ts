import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";



const getAllAdmin = catchAsync(async (req, res) => {


  const result = await AdminServices.getAllAdminsFromDB(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin data has found", data: result });
})

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminsFromDB(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin data has found", data: result });
})

const deleteSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin deleted successfully", data: result });
})

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.updateAdminOfDB(id, req.body.admin);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin updated successfully", data: result });
})

export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  deleteSingleAdmin,
  updateAdmin
};

import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";



const getAllAdmin = catchAsync(async (req, res) => {
 
  
  const result = await AdminServices.getAllAdminsFromDB(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin data has found", data: result });
})

const getSingleAdmin = catchAsync(async (req, res) => {
  const { AdminsId } = req.params;
  const result = await AdminServices.getSingleAdminsFromDB(AdminsId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin data has found", data: result });
})

const deleteSingleAdmin = catchAsync(async (req, res) => {
  const { AdminsId } = req.params;
  const result = await AdminServices.deleteAdminFromDB(AdminsId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin deleted successfully", data: result });
})

const updateAdmin = catchAsync(async (req, res) => {
  const { AdminsId } = req.params;

  const result = await AdminServices.updateAdminOfDB(AdminsId, req.body.Admins);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin updated successfully", data: result });
})

export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  deleteSingleAdmin,
  updateAdmin
};

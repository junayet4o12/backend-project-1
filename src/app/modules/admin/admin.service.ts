
import { startSession } from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Admin } from "./admin.model";
import { adminSearchableField } from "./admin.constant";
import { IAdmin } from "./admin.interface";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(Admin.find(), query).search(adminSearchableField).filter().sort().paginate().fields();
  const result = await studentQuery.modelQuery
  return result
};

const getSingleAdminsFromDB = async (id: string) => {
  const result = await Admin.findOne({ id })
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const session = await startSession()
  try {
    session.startTransaction()
    const deletedAdmin = await Admin.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });

    if (deletedAdmin === null) {
      throw new AppError(httpStatus.NOT_FOUND, "Failed to delete Admin")
    }
    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Admin")
    }
    const deleteUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete User")
    }
    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Re-throw the error for proper handling

  }


};

const updateAdminOfDB = async (id: string, payload: Partial<IAdmin>) => {
  const { name, ...remainingAdminsData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminsData,
  }
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }
  const result = await Admin.findOneAndUpdate({ id }, modifiedUpdatedData, { new: true, runValidators: true });
  return result
}

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminsFromDB,
  deleteAdminFromDB,
  updateAdminOfDB
};

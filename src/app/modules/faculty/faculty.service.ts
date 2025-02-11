
import { startSession } from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Faculty } from "./faculty.model";
import { facultySearchableField } from "./faculty.constant";
import { IFaculty } from "./faculty.interface";

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(Faculty.find(), query).search(facultySearchableField).filter().sort().paginate().fields();
  const result = await studentQuery.modelQuery.populate("managementDepartment")
  return result
};

const getSingleFacultiesFromDB = async (id: string) => {
  const result = await Faculty.findOne({ id }).populate("managementDepartment")
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await startSession()
  try {
    session.startTransaction()
    const deletedFaculty = await Faculty.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
    console.log(deletedFaculty);

    if (deletedFaculty === null) {
      throw new AppError(httpStatus.NOT_FOUND, "Failed to delete Faculty")
    }
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Faculty")
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

const updateFacultyOfDB = async (id: string, payload: Partial<IFaculty>) => {
  const { name, ...remainingFacultiesData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultiesData,
  }
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }
  const result = await Faculty.findOneAndUpdate({ id }, modifiedUpdatedData, { new: true, runValidators: true });
  return result
}

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultiesFromDB,
  deleteFacultyFromDB,
  updateFacultyOfDB
};

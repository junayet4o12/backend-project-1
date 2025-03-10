
import { startSession } from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableField } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(Student.find(), query).search(studentSearchableField).filter().sort().paginate().fields();


  const result = await studentQuery.modelQuery.populate("admissionSemester academicDepartment academicFaculty");
  const meta = await studentQuery.countTotal();
  return { meta, result }
};

const getSingleStudentsFromDB = async (id: string) => {
  const result = await Student.findById(id).populate("admissionSemester academicDepartment academicFaculty");
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await startSession()
  try {
    session.startTransaction()
    const deletedStudent = await Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });

    if (deletedStudent === null) {
      throw new AppError(httpStatus.NOT_FOUND, "Failed to delete Student")
    }
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Student")
    }
    const userId = deletedStudent.user
    const deleteUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session })
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

const updateStudentOfDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentsData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentsData,
  }
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value
    }
  }

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, { new: true, runValidators: true });
  return result
}



export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deleteStudentFromDB,
  updateStudentOfDB
};

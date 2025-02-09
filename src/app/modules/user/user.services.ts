import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { IAcademicSemester } from "../academicSemester/academicSemester.interface";
import AcademicSemester from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";
import httpStatus from "http-status";

const createStudentIntoDB = async (password: string | undefined, studentData: TStudent) => {
    // Validate the student data before using transactions
    if (!studentData.admissionSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, "Admission Semester is required");
    }

    const admissionSemester = await AcademicSemester.findById(studentData.admissionSemester);
    if (!admissionSemester) {
        throw new AppError(httpStatus.NOT_FOUND, "Admission Semester not found");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Prepare user data
        const userData: Partial<IUser> = {
            password: password || (config.default_pass as string),
            role: "student",
            id: await generateStudentId(admissionSemester as IAcademicSemester),
        };

        // Create user inside transaction
        const newUser = await User.create([{ ...userData }], { session });
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "User not created");
        }

        // Assign the created user ID to student data
        studentData.id = newUser[0].id;
        studentData.user = newUser[0]._id;

        // Manually validate studentData before saving
        const newStudent = new Student(studentData);
        const validationError = newStudent.validateSync();
        if (validationError) {
            throw new AppError(httpStatus.BAD_REQUEST, validationError.message);
        }

        // Create student inside transaction
        const savedStudent = await Student.create([{ ...studentData }], { session });
        if (!savedStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Student not created");
        }

        // Commit transaction if everything is fine
        await session.commitTransaction();
        session.endSession();

        return savedStudent[0]; // Return the created student
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw the error for proper handling
    }
};

export const UserServices = {
    createStudentIntoDB,
};

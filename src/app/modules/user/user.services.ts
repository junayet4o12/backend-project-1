import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { IAcademicSemester } from "../academicSemester/academicSemester.interface";
import AcademicSemester from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { generateFacultyId, generateStudentId, generateAdminId } from "./user.utils";
import httpStatus from "http-status";
import { IFaculty } from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { IAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";
import { user_role } from "./user.constant";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createStudentIntoDB = async (file: any, password: string | undefined, payload: TStudent) => {
    // Validate the student data before using transactions
    if (!payload.admissionSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, "Admission Semester is required");
    }

    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);
    if (!admissionSemester) {
        throw new AppError(httpStatus.NOT_FOUND, "Admission Semester not found");
    }

    const isAcademicDepartmentExist = await AcademicDepartment.findById(payload.academicDepartment);
    if (!isAcademicDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic Department not found");
    }
    payload.academicFaculty = isAcademicDepartmentExist.academicFaculty

    const session = await mongoose.startSession();
    session.startTransaction();
    const generatedId = await generateStudentId(admissionSemester as IAcademicSemester)
    try {
        // Prepare user data
        const userData: Partial<IUser> = {
            password: password || (config.default_pass as string),
            role: "student",
            id: generatedId,
            email: payload.email
        };
        if (file) {
            const imageName = `${generatedId}${payload.name.firstName}`
            const path = file?.path
            const imageData = await sendImageToCloudinary(imageName, path)
            payload.profileImage = imageData.secure_url
        }
        const newUser = await User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "User not created");
        }

        // Assign the created user ID to student data
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        // Manually validate studentData before saving
        const newStudent = new Student(payload);
        const validationError = newStudent.validateSync();
        if (validationError) {
            throw new AppError(httpStatus.BAD_REQUEST, validationError.message);
        }

        // Create student inside transaction
        const savedStudent = await Student.create([newStudent], { session });
        if (!savedStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Student not created");
        }

        // Commit transaction if everything is fine
        await session.commitTransaction();
        session.endSession();

        return savedStudent; // Return the created student
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw the error for proper handling
    }
};


const createFacultyIntoDB = async (file: any, password: string | undefined, payload: IFaculty) => {

    const managementDepartment = await AcademicDepartment.findById(payload.managementDepartment);
    if (!managementDepartment) {
        throw new AppError(httpStatus.NOT_FOUND, "Management Department not found");
    }

    payload.academicFaculty = managementDepartment.academicFaculty;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Prepare user data
        const generatedId = await generateFacultyId()
        const userData: Partial<IUser> = {
            password: password || (config.default_pass as string),
            role: "faculty",
            id: generatedId,
            email: payload.email
        };

        // Create user inside transaction
        const newUser = await User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "User not created");
        }

        // Assign the created user ID to faculty data
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        // Manually validate facultyData before saving
        const newFaculty = new Faculty(payload);

        const validationError = newFaculty.validateSync();

        if (validationError) {
            throw new AppError(httpStatus.BAD_REQUEST, validationError.message);
        }

        // Create faculty inside transaction
        if (file) {
            const imageName = `${generatedId}${payload.name.firstName}`
            const path = file?.path
            const imageData = await sendImageToCloudinary(imageName, path)
            payload.profileImage = imageData.secure_url
        }
        const savedFaculty = await Faculty.create([newFaculty], { session });
        if (!savedFaculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Faculty not created");
        }

        // Commit transaction if everything is fine
        await session.commitTransaction();
        session.endSession();

        return savedFaculty[0]; // Return the created faculty
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw the error for proper handling
    }
};

const createAdminIntoDB = async (file: any, password: string | undefined, payload: IAdmin) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Prepare user data
        const generatedId = await generateAdminId()
        const userData: Partial<IUser> = {
            password: password || (config.default_pass as string),
            role: "admin",
            id: generatedId,
            email: payload.email
        };


        const newUser = await User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "User not created");
        }

        // Assign the created user ID to admin data
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        // Manually validate adminData before saving
        const newAdmin = new Admin(payload);

        const validationError = newAdmin.validateSync();

        if (validationError) {
            throw new AppError(httpStatus.BAD_REQUEST, validationError.message);
        }

        // Create admin inside transaction
        if (file) {
            const imageName = `${generatedId}${payload.name.firstName}`
            const path = file?.path
            const imageData = await sendImageToCloudinary(imageName, path)
            payload.profileImage = imageData.secure_url
        }
        const savedAdmin = await Admin.create([newAdmin], { session });
        if (!savedAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "Faculty not created");
        }

        // Commit transaction if everything is fine
        await session.commitTransaction();
        session.endSession();

        return savedAdmin[0]; // Return the created admin
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw the error for proper handling
    }
};

const getMyData = async (id: string, role: string) => {
    let data;
    if (role === user_role.student) {
        data = await Student.findOne({ id }).populate('user');
    }
    if (role === user_role.admin) {
        data = await Admin.findOne({ id }).populate('user');
    }
    if (role === user_role.faculty) {
        data = await Faculty.findOne({ id }).populate('user');
    }

    return data
}

const changeStatus = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    return result
}

export const UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMyData,
    changeStatus
};

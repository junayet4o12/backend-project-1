import config from "../../config";
import { IAcademicSemester } from "../academicSemester/academicSemester.interface";
import AcademicSemester from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { studentValidations } from "../student/student.validation";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";

const createStudentIntoDB = async (password: string | undefined, studentData: TStudent) => {
    const userData: Partial<IUser> = {};
    userData.password = password || (config.default_pass as string);
    userData.role = 'student';

    const admissionSemester = await AcademicSemester.findById(studentData.admissionSemester);
    if(!admissionSemester) {
        throw new Error('Admission Semester not found');
    }
    userData.id = await generateStudentId(admissionSemester as IAcademicSemester);
    const newUser = await User.create(userData);
    if (Object.keys(newUser).length) {
        studentData.id = newUser.id;
        studentData.user = newUser._id

        const newStudent = await Student.create(studentData);
        return newStudent;
    }
};


export const UserServices = {
    createStudentIntoDB
}

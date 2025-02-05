import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { studentValidations } from "../student/student.validation";
import {  IUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (password: string | undefined, studentData: TStudent) => {
    const userData: Partial<IUser> = {};
    userData.password = password || (config.default_pass as string);
    userData.id = '20301000010'
    userData.role = 'student';
    
    const newUser = await User.create(userData);
    if (Object.keys(newUser).length) {
        studentData.id = newUser.id;
        studentData.user = newUser._id
        console.log(newUser._id);
        
        const newStudent = await Student.create(studentData);
        return newStudent;
    }
};


export const UserServices = {
    createStudentIntoDB
}

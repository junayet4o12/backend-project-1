import { IAcademicDepartment } from "../academicDepartment/academicDepartment.interface";
import { IAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";


const findLastStudentId = async (idQueryText: string) => {
    const lastStudent: any = await User.findOne({
        role: "student",
        id: { $regex: idQueryText }
    }, { id: 1, _id: 0 }).sort({ createdAt: -1 }).lean()

    return lastStudent ? lastStudent.id ? lastStudent.id.substring(6) : undefined : undefined
}

const findLastFacultyId = async () => {
    const lastFaculty: any = await User.findOne({
        role: "faculty",
    }, { id: 1, _id: 0 }).sort({ createdAt: -1 }).lean();
    return lastFaculty ? lastFaculty.id ? lastFaculty.id.substring(3) : undefined : undefined
}
const findLastAdminId = async () => {
    const lastAdmin: any = await User.findOne({
        role: "admin",
    }, { id: 1, _id: 0 }).sort({ createdAt: -1 }).lean();
    return lastAdmin ? lastAdmin.id ? lastAdmin.id.substring(3) : undefined : undefined
}

export const generateStudentId = async (payload: IAcademicSemester) => {

    const currentSemesterCode = payload.code;
    const currentYear = payload.year;
    const idQueryText = `${currentYear}${currentSemesterCode}`
    const currentId = await findLastStudentId(idQueryText) || (0).toString().padStart(4, "0");

    const incrementedId = (Number(currentId) + 1);
    const newId = `${payload.year}${payload.code}${incrementedId.toString().padStart(4, "0")}`

    return newId
}
export const generateFacultyId = async () => {
    const currentId = await findLastFacultyId() || (0).toString().padStart(4, "0");
    const incrementedId = (Number(currentId) + 1);
    const newId = `F-${incrementedId.toString().padStart(4, "0")}`;
    return newId
}
export const generateAdminId = async () => {
    const currentId = await findLastAdminId() || (0).toString().padStart(3, "0");
    const incrementedId = (Number(currentId) + 1);
    const newId = `A-${incrementedId.toString().padStart(4, "0")}`;
    return newId
}
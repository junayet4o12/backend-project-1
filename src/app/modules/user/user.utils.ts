import { IAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";


const findLastStudentId = async (idQueryText: string) => {
    const lastStudent: any = await User.findOne({
        role: "student",
        id: { $regex: idQueryText }
    }, { id: 1, _id: 0 }).sort({ createdAt: -1 }).lean()

    return lastStudent ? lastStudent.id ? lastStudent.id.substring(6) : undefined : undefined
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
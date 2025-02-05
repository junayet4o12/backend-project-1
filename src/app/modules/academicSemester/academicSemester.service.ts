import { IAcademicSemester } from "./academicSemester.interface";
import AcademicSemester from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (academicSemesterData: IAcademicSemester) => {

    const result = await AcademicSemester.create(academicSemesterData);
    return result
};


export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB
}

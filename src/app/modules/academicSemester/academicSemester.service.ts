import { addSemesterCode } from "./academicSemester.constant";
import { IAcademicSemester, TAcademicSemesterCode } from "./academicSemester.interface";
import AcademicSemester from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: IAcademicSemester) => {
    if (payload.name) {
        addSemesterCode(payload);
    }
    const result = await AcademicSemester.create(payload);
    return result
};
const getAllAcademicSemesterFromDB = async () => {
    const result = await AcademicSemester.find();
    return result
}
const getASingleAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id);
    return result
}
const updateAcademicSemesterIntoDB = async (id: string, payload: Partial<IAcademicSemester>) => {
    if(payload.name) {
        addSemesterCode(payload);
    }
    const result = await AcademicSemester.findByIdAndUpdate(id, payload, { new: true });
    return result
}

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getASingleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB,
}

import { IAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (faculty: IAcademicFaculty) => {
    const result = await AcademicFaculty.create(faculty);
    return result;
}
const getAllAcademicFacultyFromDB = async () => {
    const result = await AcademicFaculty.find();
    return result;
}
const getSingleAcademicFacultyFromDB = async (id: string) => {
    const result = await AcademicFaculty.findById(id);
    return result;
}
const updateSingleAcademicFacultyIntoDB = async (id: string, faculty: Partial<IAcademicFaculty>) => {
    const result = await AcademicFaculty.findByIdAndUpdate(id, faculty, { new: true });
    return result;
}

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultyFromDB,
    getSingleAcademicFacultyFromDB,
    updateSingleAcademicFacultyIntoDB,
}
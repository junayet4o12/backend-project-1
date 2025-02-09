import { IAcademicDepartment } from "./academicDepartment.interface.js";
import { AcademicDepartment } from "./academicDepartment.model.js";

const createAcademicDepartmentIntoDB = async (department: IAcademicDepartment) => {
    const result = await AcademicDepartment.create(department);
    return result;
}
const getAllAcademicDepartmentFromDB = async () => {
    const result = await AcademicDepartment.find().populate("academicFaculty");
    return result;
}
const getSingleAcademicDepartmentFromDB = async (id: string) => {
    const result = await AcademicDepartment.findById(id).populate("academicFaculty");
    return result;
}
const updateSingleAcademicDepartmentIntoDB = async (id: string, department: Partial<IAcademicDepartment>) => {
    const result = await AcademicDepartment.findByIdAndUpdate(id, department, { new: true });
    return result;
}

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentFromDB,
    getSingleAcademicDepartmentFromDB,
    updateSingleAcademicDepartmentIntoDB,
}
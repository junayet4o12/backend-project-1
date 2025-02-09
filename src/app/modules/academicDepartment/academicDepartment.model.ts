import { model, Schema } from "mongoose";
import { IAcademicDepartment } from "./academicDepartment.interface.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
const academicDepartmentSchema = new Schema<IAcademicDepartment>({
    name: { type: String, required: true, unique: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: "AcademicFaculty" }
}, {
    timestamps: true,
})



academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
    const query = this.getQuery();
    const isDepartmentExist = await AcademicDepartment.findOne(query);
    if (!isDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Department doesn't exist");
    }
    next()


})

export const AcademicDepartment = model<IAcademicDepartment>("AcademicDepartment", academicDepartmentSchema);


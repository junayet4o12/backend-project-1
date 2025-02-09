import { model, Schema, Types } from "mongoose";
import { IAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.constant";
import AppError from "../../errors/AppError";

import httpStatus from "http-status";

const academicSemesterSchema = new Schema<IAcademicSemester>({
    name: {
        type: String,
        enum: AcademicSemesterName,
        required: true
    },
    code: {
        type: String,
        enum: AcademicSemesterCode,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    startMonth: {
        type: String,
        enum: Months,
        required: true,
    },
    endMonth: {
        type: String,
        enum: Months,
        required: true,
    }
}, {
    timestamps: true
});

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExist = await AcademicSemester.findOne({
        year: this.year,
        name: this.name,
    })
    if (isSemesterExist) {
        throw new AppError(httpStatus.NOT_FOUND ,'Semester already exists');
    }
    next();
})
academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as Partial<IAcademicSemester>;
    if (!update) return next();

    const { _id: id } = this.getQuery();
    const existing = await AcademicSemester.findById(id);
    if (!existing) throw new AppError(httpStatus.NOT_FOUND,'Semester not found');

    const name = update.name ?? existing.name;
    const year = update.year ?? existing.year;

    const duplicate = await AcademicSemester.findOne({ name, year, _id: { $ne: id } });
    if (duplicate) throw new AppError(httpStatus.CONFLICT ,'Semester already exists with same name and year');

    next();
});

const AcademicSemester = model<IAcademicSemester>('AcademicSemester', academicSemesterSchema);
export default AcademicSemester;
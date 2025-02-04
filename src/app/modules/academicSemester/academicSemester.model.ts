import { model, Schema } from "mongoose";
import { IAcademicSemester, TMonths } from "./academicSemester.interface";

const months: TMonths[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const academicSemesterSchema = new Schema<IAcademicSemester>({
    name: {
        type: String,
        enum: ['Autumn', 'Summer', 'Fall'],
        required: true
    },
    code: {
        type: String,
        enum: ['01', '02', '03'],
        required: true,
    },
    year: {
        type: Date,
        required: true,
    },
    startMonth: {
        type: String,
        enum: months,
        required: true,
    },
    endMonth: {
        type: String,
        enum: months,
        required: true,
    }
});

const AcademicSemester = model<IAcademicSemester>('AcademicSemester', academicSemesterSchema);
export default AcademicSemester;
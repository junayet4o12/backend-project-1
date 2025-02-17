import { model, Schema } from "mongoose";
import { ISemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationStatusArray } from "./semesterRegistration.constant";

const semesterRegistrationSchema = new Schema<ISemesterRegistration>({
    academicSemester: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'AcademicSemester'
    },
    status: {
        type: String,
        enum: SemesterRegistrationStatusArray,
        default: 'upcoming'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    minCredit: {
        type: Number,
        required: true
    },
    maxCredit: {
        type: Number,
        required: true
    },

}, {
    timestamps: true
});

const SemesterRegistration = model<ISemesterRegistration>('SemesterRegistration', semesterRegistrationSchema)

export default SemesterRegistration
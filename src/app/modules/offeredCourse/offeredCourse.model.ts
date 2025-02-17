import { model, Schema } from "mongoose";
import { IOfferedCourse } from "./offeredCourse.interface";
import { Days } from "./offeredCourse.constant";

const OfferedCourseSchema = new Schema<IOfferedCourse>({
    semesterRegistration: { type: Schema.Types.ObjectId, ref: "SemesterRegistration", required: true },
    academicSemester: { type: Schema.Types.ObjectId, ref: "AcademicSemester", required: true },
    academicFaculty: { type: Schema.Types.ObjectId, ref: "AcademicFaculty", required: true },
    academicDepartment: { type: Schema.Types.ObjectId, ref: "AcademicDepartment", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    faculty: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    maxCapacity: { type: Number, required: true },
    section: { type: Number, required: true },
    days: [{ type: String, enum: Days, required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
}, { timestamps: true });

const OfferedCourse = model<IOfferedCourse>("OfferedCourse", OfferedCourseSchema);

export default OfferedCourse
import { model, Schema } from "mongoose";
import { Grade } from "./enrolledCourse.const";
import { ICourseMarks, IEnrolledCourse } from "./enrolledCourse.interface";

const CourseMarksSchema = new Schema<ICourseMarks>({
    classTest1: { type: Number, min: 0, max: 10 },
    midTerm: { type: Number, min: 0, max: 30 },
    classTest2: { type: Number, min: 0, max: 10 },
    finalTerm: { type: Number, min: 0, max: 50 },
});

const EnrolledCourseSchema = new Schema<IEnrolledCourse>({
    semesterRegistration: { type: Schema.Types.ObjectId, required: true, ref: "SemesterRegistration" },
    academicSemester: { type: Schema.Types.ObjectId, required: true, ref: "AcademicSemester" },
    academicFaculty: { type: Schema.Types.ObjectId, required: true, ref: "AcademicFaculty" },
    academicDepartment: { type: Schema.Types.ObjectId, required: true, ref: "AcademicDepartment" },
    offeredCourse: { type: Schema.Types.ObjectId, required: true, ref: "OfferedCourse" },
    course: { type: Schema.Types.ObjectId, required: true, ref: "Course" },
    student: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    faculty: { type: Schema.Types.ObjectId, required: true, ref: "Faculty" },
    isEnrolled: { type: Boolean, default: false },
    courseMarks: {
        type: CourseMarksSchema,
        default: {}
    },
    grade: { type: String, enum: Grade, default: 'NA' },
    gradePoints: { type: Number, default: 0, min: 0, max: 4 },
    isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

const EnrolledCourse = model<IEnrolledCourse>("EnrolledCourse", EnrolledCourseSchema);

export default EnrolledCourse;

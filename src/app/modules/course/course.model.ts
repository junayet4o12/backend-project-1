import { model, Schema } from "mongoose";
import { ICourse, ICourseFaculty, IPreRequisiteCourses } from "./course.interface";



const preRequisiteCoursesSchema = new Schema<IPreRequisiteCourses>({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'

    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})
const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    prefix: {
        type: String,
        trim: true,
        required: true
    },
    code: {
        type: Number,
        unique: true,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: {
        type: Boolean,
        default: false
    }
})

export const Course = model<ICourse>('Course', courseSchema)


const courseFacultySchema = new Schema<ICourseFaculty>({
    faculties: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Faculty'
        }
    ],
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, {
    timestamps: true
});

export const CourseFaculty = model<ICourseFaculty>('CourseFaculty', courseFacultySchema);
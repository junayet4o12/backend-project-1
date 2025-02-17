
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { IOfferedCourse, ISchedule } from "./offeredCourse.interface";
import OfferedCourse from "./offeredCourse.model";
import SemesterRegistration from "../semesterRegistration/semesterRegistration.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { Course } from "../course/course.model";
import { hasTimeConflict } from "./offeredCourse.utils";
import { Types } from "mongoose";


const createOfferedCourseIntoDB = async (payload: IOfferedCourse) => {
    const { faculty, course, academicDepartment, academicFaculty, semesterRegistration, section, days, startTime, endTime } = payload;

    const isSemesterRegistrationExist = await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found');
    }
    const academicSemester = isSemesterRegistrationExist.academicSemester;

    const isAcademicFacultyExist = await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found');
    }

    const isAcademicDepartmentExist = await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
    }

    const isFacultyExist = await Faculty.findById(faculty);
    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
    }

    const isCourseExist = await Course.findById(course);
    if (!isCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    }



    if (isAcademicDepartmentExist.academicFaculty.toString() !== isAcademicFacultyExist._id.toString()) {
        throw new AppError(httpStatus.BAD_REQUEST, `the ${isAcademicDepartmentExist.name} department is not under ${isAcademicFacultyExist.name} faculty!`);
    }

    const isOfferedCourseExistWithSameCourseSectionAndSemesterRegistration = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section
    })
    if (isOfferedCourseExistWithSameCourseSectionAndSemesterRegistration) {
        throw new AppError(httpStatus.BAD_REQUEST, `An Offered Course is exist with the same course, section and Semester registration.`);
    }

    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select('days startTime endTime')
    console.log(assignedSchedules);
    const newSchedule = {
        days,
        startTime, endTime
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.BAD_REQUEST, `This Faculty is not available at that time! Choose other time or date`);
    }

    const result = await OfferedCourse.create({ ...payload, academicSemester });
    return result;
    // return null
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const studentQuery = new QueryBuilder(OfferedCourse.find(), query).filter().sort().paginate().fields();
    const result = await studentQuery.modelQuery.populate('semesterRegistration').populate('academicSemester').populate('academicFaculty').populate('academicDepartment').populate('course').populate('faculty')
    return result
};

const getSingleOfferedCourseFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id).populate('semesterRegistration').populate('academicSemester').populate('academicFaculty').populate('academicDepartment').populate('course').populate('faculty')
    return result;
};
const updateOfferedCourseOfDB = async (id: string, payload: Pick<IOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>) => {
    const isOfferedCourseExist = await OfferedCourse.findById(id);
    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, `Offered Course not found`);
    }
    const { faculty, days, startTime, endTime } = payload;
console.log(faculty);

    const isFacultyExist = await Faculty.findById(faculty);
    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
    }
    const semesterRegistration = isOfferedCourseExist.semesterRegistration

    const semesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistration);
    if (semesterRegistrationStatus?.status !== 'upcoming') {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot update the offered course as it is ${semesterRegistrationStatus?.status}`);
    } 

    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
        _id: { $ne: new Types.ObjectId(id) }
    }).select('days startTime endTime')
    console.log(assignedSchedules);

    const newSchedule = {
        days,
        startTime,
        endTime
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(httpStatus.BAD_REQUEST, `This Faculty is not available at that time! Choose other time or date`);
    }


    const result = await OfferedCourse.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return result
}

export const OfferedCourseServices = {
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseOfDB,
    createOfferedCourseIntoDB
};


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
import { Student } from "../student/student.model";


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
    const result = await studentQuery.modelQuery.populate('semesterRegistration').populate('academicSemester').populate('academicFaculty').populate('academicDepartment').populate('course').populate('faculty');
    const meta = await studentQuery.countTotal();
    return {
        result,
        meta
    }
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

const getMyOfferedCourseFromDB = async (studentId: string, query: Record<string, unknown>) => {



    const studentData = await Student.findOne({ id: studentId }).lean();
    if (!studentData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found!')
    }

    const currentOnGoingRegistrationSemester = await SemesterRegistration.findOne({ status: 'ongoing' });
    if (!currentOnGoingRegistrationSemester) {
        throw new AppError(httpStatus.NOT_FOUND, 'There is no on going semester registration!')
    }
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 1;

    const skip = (page - 1) * limit;

    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOnGoingRegistrationSemester._id,
                academicFaculty: studentData.academicFaculty,
                academicDepartment: studentData.academicDepartment
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course'
            }
        },
        {
            $unwind: '$course'
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOnGoingRegistrationSemester: currentOnGoingRegistrationSemester._id,
                    studentId: studentData._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$semesterRegistration', '$$currentOnGoingRegistrationSemester']
                                    },
                                    {
                                        $eq: ['$student', '$$studentId']
                                    },
                                    {
                                        $eq: ['$isEnrolled', true]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: 'enrolledCourses'
            }
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    studentId: studentData._id
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$studentId'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: 'completedCourses'
            }
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course'
                    }
                }
            }
        },

        {
            $addFields: {
                isPreRequisitesFullFilled: {
                    $or: [
                        {
                            $eq: ['$course.preRequisiteCourses', []]
                        },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds'
                            ]
                        }
                    ]
                },

                isAlreadyEnrolled: {
                    $in: ['$course._id', {
                        $map: {
                            input: '$enrolledCourses',
                            as: 'enroll',
                            in: '$$enroll.course'
                        }
                    }]
                }
            }
        },

        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFullFilled: true
            }
        },
    ]

    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        }
    ]

    const result = await OfferedCourse.aggregate([...aggregationQuery, ...paginationQuery])
    const total = (await OfferedCourse.aggregate([...aggregationQuery])).length
    const totalPage = Math.ceil(total / limit);
    const meta = {
        page, limit, total, totalPage
    }
    return {
        meta,
        result
    }
};

export const OfferedCourseServices = {
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseOfDB,
    createOfferedCourseIntoDB,
    getMyOfferedCourseFromDB
};

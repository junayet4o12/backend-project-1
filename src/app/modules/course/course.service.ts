import { startSession, Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { ICourse, ICourseFaculty } from "./course.interface"
import { Course, CourseFaculty } from "./course.model"
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
const createCourseIntoDB = async (payload: ICourse) => {

    const result = await Course.create(payload);
    return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find(), query).search(CourseSearchableFields).filter().sort().paginate().fields()
    const result = await courseQuery.modelQuery.populate('preRequisiteCourses.course');
    const meta = await courseQuery.countTotal();
    return { meta, result }
}
const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
}
const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result
}

const updateCourseOfDB = async (id: string, payload: Partial<ICourse>) => {
    const { preRequisiteCourses, ...rest } = payload;
    const session = await startSession();
    try {
        session.startTransaction()
        // Update basic course information first
        const updateBasicCourseInfo = await Course.findByIdAndUpdate(id, rest, {
            new: true,
            runValidators: true,
            session
        });
        if (!updateBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Course')
        }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletedPreRequisites = preRequisiteCourses
                .filter(item => item.course && item.isDeleted)
                .map(item => item.course);

            const newPreRequisites = preRequisiteCourses
                .filter(item => item.course && !item.isDeleted);

            // Step 1: Remove deleted prerequisites
            if (deletedPreRequisites.length > 0) {
                const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
                    id,
                    {
                        $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } },
                    },
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );
                if (!deletedPreRequisitesCourses) {
                    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Course')
                }
            }

            // Step 2: Add new prerequisites
            if (newPreRequisites.length > 0) {
                const newPreRequisitesCourses = await Course.findByIdAndUpdate(
                    id,
                    {
                        $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
                    },
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );
                if (!newPreRequisitesCourses) {
                    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Course')
                }
            }
        }
        await session.commitTransaction()
        await session.endSession()
        // Fetch the updated course with populated preRequisiteCourses
        const result = await Course.findById(id).populate('preRequisiteCourses.course');

        return result;

    } catch (error) {
        session.abortTransaction()
        session.endSession()
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Course')
    }
};

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<ICourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } }
        },
        {
            upsert: true,
            new: true
        }
    )
    return result
}

const removeFacultiesFromCourseIntoDB = async (id: string, payload: Partial<ICourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } }
        },
        {
            new: true
        }
    )
    return result
}

const getCourseFaculties = async (id: string) => {
    const result = await CourseFaculty.findOne({ course: id }).populate('faculties')
    return result
}





export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseOfDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseIntoDB,
    getCourseFaculties
}
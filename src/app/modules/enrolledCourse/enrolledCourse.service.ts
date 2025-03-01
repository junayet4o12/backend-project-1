import httpStatus from 'http-status';
import { startSession } from 'mongoose';

import AppError from '../../errors/AppError';
import OfferedCourse from '../offeredCourse/offeredCourse.model';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';
import { IEnrolledCourse } from './enrolledCourse.interface';
import SemesterRegistration from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradePoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnrolledCourseIntoDB = async (
  id: string,
  { offeredCourse: offeredCourseId }: { offeredCourse: string }
) => {
  // Step 1: Validate offered course existence and capacity
  const offeredCourse = await OfferedCourse.findById(offeredCourseId);
  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
  }
  const { maxCapacity, semesterRegistration, academicDepartment, academicSemester, academicFaculty, course: courseId, faculty } = offeredCourse;

  if (maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full!');
  }

  // Step 2: Validate student existence
  const student = await Student.findOne({ id }).select('_id').lean();
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  // Step 3: Check if student is already enrolled
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse: offeredCourseId,
    student: student._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled!');
  }

  // Step 4: Validate semester registration and credit limits
  const semesterRegistrationData = await SemesterRegistration.findById(
    semesterRegistration
  )
    .select('maxCredit')
    .lean();
  if (!semesterRegistrationData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found!');
  }
  const { maxCredit } = semesterRegistrationData;

  // Step 5: Calculate total enrolled credits
  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    { $unwind: '$enrolledCourseData' },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: { _id: 0, totalEnrolledCredits: 1 },
    },
  ]);

  const course = await Course.findById(courseId)
    .select('credits')
    .lean();
  const { credits = 0 } = course || {};

  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
  if ((totalCredits + credits) > maxCredit && maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded the maximum number of credits'
    );
  }

  // Step 6: Enroll student in the course using transaction
  const session = await startSession();
  try {
    session.startTransaction();

    const enrolledCourseData: IEnrolledCourse = {
      semesterRegistration,
      academicDepartment,
      academicSemester,
      academicFaculty,
      course: courseId,
      faculty,
      student: student._id,
      offeredCourse: offeredCourse._id,
      isEnrolled: true,
    };

    const result = await EnrolledCourse.create([enrolledCourseData], { session });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enroll in this course');
    }

    await OfferedCourse.findByIdAndUpdate(offeredCourseId, {
      $inc: { maxCapacity: -1 },
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateEnrolledCourseMarksIntoDB = async (id: string, payload: Partial<IEnrolledCourse>) => {
  const { semesterRegistration, offeredCourse, courseMarks, student } = payload;
  const isSemesterRegistrationExist = await SemesterRegistration.findById(semesterRegistration)
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }
  const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
  }
  const isStudentExist = await Student.findById(student);
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const faculty = await Faculty.findOne({ id }).select('_id').lean();


  const isCourseBelongToTheFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id
  });

  if (!isCourseBelongToTheFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Enrolled Course is not found!');
  }

  const classTest1 = payload?.courseMarks?.classTest1 ?? isCourseBelongToTheFaculty.courseMarks?.classTest1 ?? 0;
  const classTest2 = payload?.courseMarks?.classTest2 ?? isCourseBelongToTheFaculty.courseMarks?.classTest2 ?? 0;
  const midTerm = payload?.courseMarks?.midTerm ?? isCourseBelongToTheFaculty.courseMarks?.midTerm ?? 0;
  const finalTerm = payload?.courseMarks?.finalTerm ?? isCourseBelongToTheFaculty.courseMarks?.finalTerm;
  let modifiedData;
  if (finalTerm !== undefined) {
    const totalMarks = classTest1 + classTest2 + midTerm + finalTerm;
    console.log(totalMarks);
    modifiedData = {
      ...calculateGradePoints(totalMarks),
      isCompleted: true
    }
  }

  const updatedMarks = Object.fromEntries(Object.entries(courseMarks || {}).map(([key, value]) => [`courseMarks.${key}`, value]))
  const result = await EnrolledCourse.findByIdAndUpdate(isCourseBelongToTheFaculty._id, { ...updatedMarks, ...modifiedData }, { new: true })
  return result
}

const myEnrolledCourses = async (id: string, query: Record<string, unknown>) => {
  const student = await Student.findOne({ id }).select('_id').lean();
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const enrolledCourseQuery = new QueryBuilder(EnrolledCourse.find({ student: student._id }), query);
  const result = await enrolledCourseQuery.modelQuery.populate('semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty');
  const meta = await enrolledCourseQuery.countTotal();
  return {
    meta,
    result
  }
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  myEnrolledCourses
};

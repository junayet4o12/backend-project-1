import AppError from "../../errors/AppError";
import AcademicSemester from "../academicSemester/academicSemester.model";
import { ISemesterRegistration } from "./semesterRegistration.interface";
import httpStatus from "http-status";
import SemesterRegistration from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { SemesterRegistrationStatus } from "./semesterRegistration.constant";

const { upcoming, ongoing, ended } = SemesterRegistrationStatus

const createSemesterRegistrationIntoDB = async (payload: ISemesterRegistration) => {
    const academicSemester = payload.academicSemester

    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
        $or: [
            { status: upcoming },
            { status: ongoing },
        ]
    })

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered Semester`)
    }

    const isAcademicSemesterExist = academicSemester ? await AcademicSemester.findById(academicSemester) : null;

    if (!isAcademicSemesterExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'The academic semester not found!')
    }

    const isSemesterRegistrationExist = await SemesterRegistration.findOne({ academicSemester })

    if (isSemesterRegistrationExist) {
        throw new AppError(httpStatus.CONFLICT, 'The academic semester already registered!')
    }

    const result = await SemesterRegistration.create(payload);
    return result
}

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find(), query).filter().fields().sort().paginate();
    const result = await semesterRegistrationQuery.modelQuery.populate('academicSemester');
    return result;
}
const getSingleSemesterRegistrationFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id)
    return result;
}

const updateSemesterRegistrationOfDB = async (id: string, payload: Partial<ISemesterRegistration>) => {
    const requestedSemester = await SemesterRegistration.findById(id) as ISemesterRegistration;
    const currentStatus = requestedSemester.status;
    const requestedStatus = payload?.status
    if (!requestedSemester) {
        throw new AppError(httpStatus.NOT_FOUND, 'The Semester is not found')
    }

    if (currentStatus === ended) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This registered semester is already ended')
    }

    if (requestedStatus === ended && currentStatus === upcoming) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You cannot directly update the semester status from upcoming to ended')
    }

    if (currentStatus === ongoing && requestedStatus === upcoming) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The current registered is on Ongoing. You cannot make it upcoming')
    }

    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    return result
};




export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationOfDB
}
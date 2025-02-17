import { Types } from "mongoose";

export interface ISemesterRegistration {
    academicSemester: Types.ObjectId;
    status: 'upcoming' | 'ongoing' | 'ended';
    startDate: Date;
    endDate: Date;
    minCredit: number;
    maxCredit: number;
}
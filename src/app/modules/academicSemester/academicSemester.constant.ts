import { IAcademicSemester, TAcademicSemesterCode, TAcademicSemesterName, TMonths } from "./academicSemester.interface";

export const Months: TMonths[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
export const AcademicSemesterName: TAcademicSemesterName[] = ['Autumn', 'Summer', 'Fall'];
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];

export const addSemesterCode = (payload: Partial<IAcademicSemester>) => {
    const academicSemesterNameCodeMapper: {
        [key: string]: string
    } = {
        Autumn: '01',
        Summer: '02',
        Fall: '03',
    }
    payload.code = academicSemesterNameCodeMapper[payload.name as TAcademicSemesterName] as TAcademicSemesterCode;
}
import { Model, Types } from "mongoose";
import { IUserName } from "../../interface/userName";

export interface IFaculty {
    id: string;
    user: Types.ObjectId;
    name: IUserName;
    email: string;
    designation: string;
    contact: string;
    emergencyContact: string;
    gender: "male" | "female" | "other";
    dateOfBirth?: string;
    presentAddress: string;
    permanentAddress: string;
    profileImage?: string;
    managementDepartment: Types.ObjectId;
    isDeleted: boolean;
}

export interface IFacultyModel extends Model<IFaculty> {
    isUserExist(id: string): Promise<IFaculty | null>;
}
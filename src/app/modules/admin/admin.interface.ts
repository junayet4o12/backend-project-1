import { Model, Types } from "mongoose";
import { IUserName } from "../../interface/userName";

export interface IAdmin {
    id: string;
    user: Types.ObjectId;
    name: IUserName;
    email: string;
    contact: string;
    emergencyContact: string;
    gender: "male" | "female" | "other";
    dateOfBirth?: string;
    presentAddress: string;
    permanentAddress: string;
    profileImage?: string;
    isDeleted: boolean;
}

export interface IAdminModel extends Model<IAdmin> {
    isUserExist(id: string): Promise<IAdmin | null>;
}
import { Model, Types } from "mongoose";
import { IUserName } from "../../interface/userName";

export interface TGuardian {
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
}

export interface TLocalGuardian {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
}
export interface TStudent {
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
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  profileImage?: string;
  admissionSemester?: Types.ObjectId;
  academicDepartment?: Types.ObjectId;
  isDeleted: boolean;
}

export interface TStudentModel extends Model<TStudent> {
  isUserExist(id: string): Promise<TStudent | null>;
}
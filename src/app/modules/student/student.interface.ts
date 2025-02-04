import { Model, Types } from "mongoose";

export interface TGuardian {
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
}
export interface TUserName {
  firstName: string;
  middleName: string;
  lastName: string;
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
  password: string;
  name: TUserName;
  email: string;
  contact: string;
  emergencyContact: string;
  gender: "male" | "female" | "other";
  dateOfBirth?: Date;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  profileImage?: string;
  isDeleted: boolean;
}

export interface TStudentModel extends Model<TStudent> {
  isUserExist(id: string): Promise<TStudent | null>;
}

// export interface TStudentMethods {
//   isUserExist(id: string): Promise<TStudent | null>;
// }
// export type TStudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   TStudentMethods
// >;

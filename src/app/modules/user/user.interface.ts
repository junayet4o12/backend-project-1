import { Model } from "mongoose";
import { user_role } from "./user.constant";

export interface IUser {
    id: string;
    email: string;
    password: string;
    passwordChangedAt: Date;
    needsPasswordChange: boolean;
    role: 'admin' | 'student' | 'faculty' | 'superAdmin';
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
}

export interface IUserCheckingOptions {
    checkIsUserExist?: boolean;
    checkIsUserDeleted?: boolean;
    checkIsUserBlocked?: boolean;
    plainTextPassword?: string;
    giveUserData?: boolean;
}
export interface IReturningData {
    isUserExist?: boolean;
    isUserDeleted?: boolean;
    isUserBlocked?: boolean;
    isPasswordMatched?: boolean;
    userData?: IUser;
}

export interface IUserModel extends Model<IUser> {
    checkingUser(payload: string | IUser, checkingOptions: IUserCheckingOptions): Promise<IReturningData>;
    isJwtIssuedBeforePasswordChanged(passwordChangedTimestamp: Date, jwtIssuedTimeStamp: number): boolean;
}

export type TUserRole = keyof typeof user_role

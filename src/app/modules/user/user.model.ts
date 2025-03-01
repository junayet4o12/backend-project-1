import httpStatus from 'http-status';
import { model, Schema } from "mongoose";
import { IReturningData, IUser, IUserCheckingOptions, IUserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import { user_status } from './user.constant';
const userSchema = new Schema<IUser, IUserModel>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: 0
    },
    passwordChangedAt: {
        type: Date,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'faculty', 'superAdmin'],
        required: true
    },
    status: {
        type: String,
        enum: user_status,
        default: 'in-progress'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
userSchema.pre("save", async function (next) {
    const user = this;
    // hashing password and save into db
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );
    next();
});

// post save middleware / hook
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
userSchema.statics.checkingUser = async function (
    payload: string,
    checkingOption: IUserCheckingOptions
) {
    const { checkIsUserExist, checkIsUserDeleted, checkIsUserBlocked, plainTextPassword, giveUserData } = checkingOption;


    let userData: IUser | null = null;
    let returningData: IReturningData = {};

    if (typeof payload === 'string') {
        const user = await User.findOne({ id: payload }).select('+password');

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found');
        }
        userData = user;
    } else {
        throw new AppError(httpStatus.BAD_REQUEST, 'Use valid data for User');
    }

    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User data is missing');
    }
    if (giveUserData) {
        returningData.userData = userData
    }
    if (checkIsUserExist) {
        returningData.isUserExist = !!userData;
    }
    if (checkIsUserDeleted) {
        returningData.isUserDeleted = userData.isDeleted || false;
    }
    if (checkIsUserBlocked) {
        returningData.isUserBlocked = userData.status === 'blocked' ? true : false;
    }
    if (plainTextPassword) {
        const isPasswordMatched = await bcrypt.compare(plainTextPassword, userData.password);
        returningData.isPasswordMatched = isPasswordMatched;
    }

    return returningData;
};
userSchema.statics.isJwtIssuedBeforePasswordChanged = function (passwordChangedTimestamp: Date, jwtIssuedTimeStamp: number) {
    const passwordChangeTime = new Date(passwordChangedTimestamp).getTime()
    const jwtIssuedTime = jwtIssuedTimeStamp * 1000


    return passwordChangeTime > jwtIssuedTime
}

export const User = model<IUser, IUserModel>("User", userSchema)
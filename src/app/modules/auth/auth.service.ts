import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import httpStatus from 'http-status';
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";
import { IUserCheckingOptions, TUserRole } from '../user/user.interface';
import config from '../../config';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: ILoginUser) => {
    const checkingOption: IUserCheckingOptions = {
        checkIsUserExist: true,
        checkIsUserDeleted: true,
        checkIsUserBlocked: true,
        plainTextPassword: payload.password,
        giveUserData: true,
    }

    const checkUser = await User.checkingUser(payload.id, checkingOption)
    const { isUserExist, isUserBlocked, isUserDeleted, isPasswordMatched, userData } = checkUser;


    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has deleted')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password')
    }

    const jwtPayload = {
        userId: userData?.id as string,
        role: userData?.role as TUserRole
    }
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as SignOptions["expiresIn"])
    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as SignOptions["expiresIn"])

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData?.needsPasswordChange
    }
}

const changePassword = async (user: JwtPayload, payload: { newPassword: string; oldPassword: string }) => {
    const checkingOption: IUserCheckingOptions = {
        checkIsUserExist: true,
        checkIsUserDeleted: true,
        checkIsUserBlocked: true,
        plainTextPassword: payload.oldPassword,
        giveUserData: true,
    }

    const checkUser = await User.checkingUser(user.userId, checkingOption)
    const { isUserExist, isUserBlocked, isUserDeleted, isPasswordMatched, userData } = checkUser;

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has deleted')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password')
    }
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds))
    await User.findOneAndUpdate({
        id: user.userId,
        role: user.role,
    },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date()
        }
    )
    return null
}

const refreshToken = async (token: string) => {

    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload

    const { userId, iat } = decoded;

    const checkingOption = {
        checkIsUserExist: true,
        checkIsUserDeleted: true,
        checkIsUserBlocked: true,
        giveUserData: true

    }

    const checkUser = await User.checkingUser(userId, checkingOption)
    const { isUserExist, isUserBlocked, isUserDeleted, userData } = checkUser;

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has deleted')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    if (userData?.passwordChangedAt && User.isJwtIssuedBeforePasswordChanged(userData?.passwordChangedAt, iat as number)) {

        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')

    }
    const jwtPayload = {
        userId: userData?.id as string,
        role: userData?.role as TUserRole
    }
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as SignOptions["expiresIn"])
    return { accessToken }
}

const forgetPassword = async (id: string) => {
    const checkingOption = {
        checkIsUserExist: true,
        checkIsUserDeleted: true,
        checkIsUserBlocked: true,
        giveUserData: true

    }

    const checkUser = await User.checkingUser(id, checkingOption)
    const { isUserExist, isUserBlocked, isUserDeleted, userData } = checkUser;

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has deleted')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    const jwtPayload = {
        userId: userData?.id as string,
        role: userData?.role as TUserRole
    }
    const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, '10m')

    const resetUILink = `${config.reset_pass_ui_link}?id=${userData?.id}&token=${resetToken}`
    sendEmail(userData?.email as string, resetUILink)
}

const resetPassword = async (payload: {
    id: string;
    newPassword: string;
}, token: string) => {

    const checkingOption = {
        checkIsUserExist: true,
        checkIsUserDeleted: true,
        checkIsUserBlocked: true,
        giveUserData: true

    }

    const checkUser = await User.checkingUser(payload.id, checkingOption)
    const { isUserExist, isUserBlocked, isUserDeleted, userData } = checkUser;

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has deleted')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload

    const { userId, role, iat } = decoded;
    if (userId !== payload.id) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
    }
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds))
    await User.findOneAndUpdate({
        id: userId,
        role: role
    },
        {
            password: newHashedPassword,
            passwordChangedAt: new Date()
        }
    )
}

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
}
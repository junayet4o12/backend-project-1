import jwt, { decode, JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';



const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
        }

        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload

        const { role, userId, iat } = decoded;

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

        if (requiredRoles && !requiredRoles.includes(role)) {
            
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
        }
        if (userData?.passwordChangedAt && User.isJwtIssuedBeforePasswordChanged(userData?.passwordChangedAt, iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')

        }
        req.user = decoded as JwtPayload
        next()
    })
}

export default auth;
import { TUserRole } from '../user/user.interface';
import jwt, { SignOptions } from 'jsonwebtoken';
export const createToken = (jwtPayload: { userId: string; role: TUserRole }, accessSecret: string, expiresIn: SignOptions["expiresIn"]) => {
    return jwt.sign(jwtPayload, accessSecret, { expiresIn })
}
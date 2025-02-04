import { NextFunction, Request, RequestHandler, Response } from "express";
const catchAsync = (handler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch(err => next(err))
    }
}

export default catchAsync
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";



const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';
    let errorSources: TErrorSources = [{
        path: '',
        message: 'Something went wrong',

    }]


    if (err instanceof ZodError) {
        const simplifiedError: TGenericErrorResponse = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources
    } else if (err?.name === 'ValidationError') {
        const simplifiedError: TGenericErrorResponse = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources

    } else if (err?.name === 'CastError') {
        const simplifiedError: TGenericErrorResponse = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources
    } else if (err?.code === 11000) {
        const simplifiedError: TGenericErrorResponse = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources
    } else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ]
    } else if (err instanceof Error) {
        
        message = err.message
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ]
    }

    return res.status(statusCode).json({
        success: false,
        message,
        // err: err,
        errorSource: errorSources,
        stack: config.NODE_ENV === 'development' ? err?.stack : null
    })
}

export default globalErrorHandler;

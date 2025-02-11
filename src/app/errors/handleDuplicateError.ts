import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (error: any): TGenericErrorResponse => {
    const statusCode = 400;
    const key = Object.keys(error.errorResponse.keyPattern)[0];
    const value = error.errorResponse.keyValue[key];
    const errorSources: TErrorSources = [{
        path: key,
        message: `${value} already exist`
    }]

    return {
        statusCode,
        message: 'Duplicate Error',
        errorSources
    }
}

export default handleDuplicateError
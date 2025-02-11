import { Error } from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleValidationError = (error: Error.ValidationError): TGenericErrorResponse => {
    const statusCode = 400;
    const errorSources: TErrorSources = Object.values(error.errors).map((value: Error.ValidatorError | Error.CastError) => {
        return {
            path: value.path,
            message: value.message
        }
    })

    return {
        statusCode,
        message: 'Validation Error',
        errorSources
    }
}

export default handleValidationError
import { StatusCode } from "../interface/StatusCode.js";
export function handleError(error, customMessage) {
    let message;
    if (error instanceof Error) {
        console.log(customMessage || "An error occurred", { message: error.message, stack: error.stack });
        message = customMessage || error.message;
    }
    else {
        console.log(customMessage || "Unknown error occurred", { message: String(error) });
        message = customMessage || "Unknown error occurred";
    }
    return { status: StatusCode.InternalServerError, message };
}

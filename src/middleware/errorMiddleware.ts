import { StatusCode } from "../interface/StatusCode.js";
import { IResponse } from "../interface/IResponse.js";

export function handleError(error: unknown, customMessage?: string): IResponse {
    let message: string;
    if (error instanceof Error) {
        console.log(customMessage || "An error occurred", { message: error.message, stack: error.stack });
        message = customMessage || error.message;
    } else {
        console.log(customMessage || "Unknown error occurred", { message: String(error) });
        message = customMessage || "Unknown error occurred";
    }
    return { status: StatusCode.InternalServerError, message };
}

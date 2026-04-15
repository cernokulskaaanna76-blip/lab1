export class ApiError extends Error {
    status: number;
    code: string;
    details: any;

    constructor(status: number, code: string, message: string, details: any = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }

    static badRequest(message: string, details: any = null) {
        return new ApiError(400, "VALIDATION_ERROR", message, details);
    }

    static notFound(message = "Resource not found") {
        return new ApiError(404, "NOT_FOUND", message, null);
    }
}
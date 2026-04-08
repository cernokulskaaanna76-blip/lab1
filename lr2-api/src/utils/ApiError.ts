export class ApiError extends Error {
    statusCode: number;
    code: string;
    details: unknown;

    constructor(statusCode: number, code: string, message: string, details: unknown = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }

    static badRequest(message = "Bad Request", details: unknown = null) {
        return new ApiError(400, "VALIDATION_ERROR", message, details);
    }

    static notFound(message = "Resource not found", details: unknown = null) {
        return new ApiError(404, "NOT_FOUND", message, details);
    }

    static conflict(message = "Conflict", details: unknown = null) {
        return new ApiError(409, "CONFLICT", message, details);
    }

    static internal(message = "Internal Server Error", details: unknown = null) {
        return new ApiError(500, "INTERNAL_ERROR", message, details);
    }
}
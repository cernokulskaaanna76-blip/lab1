class ApiError extends Error {
    constructor(status, code, message, details = null) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }

    static BadRequest(message, details = null) {
        return new ApiError(400, 'BAD_REQUEST', message, details);
    }

    static Unauthorized(message = 'Користувач не авторизований') {
        return new ApiError(401, 'UNAUTHORIZED', message);
    }

    static Forbidden(message = 'Доступ заборонено') {
        return new ApiError(403, 'FORBIDDEN', message);
    }

    static NotFound(message = 'Ресурс не знайдено') {
        return new ApiError(404, 'NOT_FOUND', message);
    }

    static Internal(message = 'Внутрішня помилка сервера') {
        return new ApiError(500, 'INTERNAL_SERVER_ERROR', message);
    }
}

module.exports = ApiError;
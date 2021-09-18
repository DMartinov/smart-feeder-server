export default class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'User not authorized');
    }

    static Forbidden() {
        return new ApiError(403, 'User has no permissions to view this content');
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}

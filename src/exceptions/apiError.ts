export default class ApiError extends Error {
    status;
    errors;

    constructor(status:number, message:string, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(): ApiError {
        return new ApiError(401, 'User not authorized');
    }

    static Forbidden(): ApiError {
        return new ApiError(403, 'User has no permissions to view this content');
    }

    static BadRequest(message:string, errors = []): ApiError {
        return new ApiError(400, message, errors);
    }
}

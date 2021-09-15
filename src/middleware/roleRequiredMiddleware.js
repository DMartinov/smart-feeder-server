import ApiError from "../exceptions/apiError.js";

export default (requiredRoles) => {
    return (request, response, next) => {
        if (requiredRoles.contains(request.user?.role)) {
            return next();
        }

        return next(ApiError.Forbidden());
    }
};

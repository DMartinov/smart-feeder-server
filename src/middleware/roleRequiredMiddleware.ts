import ApiError from '../exceptions/apiError';

export default (requiredRoles) => (request, response, next) => {
    if (requiredRoles.contains(request.user?.role)) {
        return next();
    }

    return next(ApiError.Forbidden());
};

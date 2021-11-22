import ApiError from '../exceptions/apiError';
import { UserRole } from '../models/enums';

export default (requiredRoles: Array<UserRole>) => (request, response, next) => {
    if (requiredRoles.some((role) => role === request.user?.role)) {
        return next();
    }

    return next(ApiError.Forbidden());
};

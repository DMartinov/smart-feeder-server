import { Response, NextFunction } from 'express';
import ApiError from '../exceptions/apiError';
import AuthorizedRequest from '../models/authorizedRequest';
import { UserRole } from '../models/enums';

export default (requiredRoles: Array<UserRole>) => (request: AuthorizedRequest, response: Response, next: NextFunction): void => {
    if (requiredRoles.some((role) => role === request.user?.role)) {
        return next();
    }

    return next(ApiError.Forbidden());
};

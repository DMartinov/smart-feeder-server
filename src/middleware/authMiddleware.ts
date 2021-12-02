import ApiError from '../exceptions/apiError';
import TokenHelper from '../helpers/tokenHelper';
import { UserRole } from '../models/enums';

export default (request, response, next) => {
    try {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = TokenHelper.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        request.user = userData.payload;
        request.user.isSuperAdmin = request.user?.role === UserRole.superAdmin;

        return next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
};

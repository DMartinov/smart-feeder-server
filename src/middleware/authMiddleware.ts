import { Response, NextFunction } from 'express';
import AuthorizedRequest from '../models/authorizedRequest';
import ApiError from '../exceptions/apiError';
import TokenHelper from '../helpers/tokenHelper';

export default (request: AuthorizedRequest, response: Response, next: NextFunction): void => {
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

        return next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
};

import ApiError from "../exceptions/apiError.js";
import TokenHelper from "../helpers/tokenHelper.js";

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

        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
}
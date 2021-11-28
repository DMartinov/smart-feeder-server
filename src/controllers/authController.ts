import { validationResult } from 'express-validator';
import AuthService from '../services/authService';
import ApiError from '../exceptions/apiError';
import constants from '../constants';

export default class AuthController {
    static async signUp(request, response, next) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation errors', errors.array()));
            }

            const { activationId, password, name } = request.body;
            const tokens = await AuthService.signUp(name, password, activationId);
            response.cookie(constants.refreshCookieName, tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return response.json(tokens.accessToken);
        } catch (error) {
            return next(error);
        }
    }

    static async logIn(request, response, next) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation errors', errors.array()));
            }

            const { email, password } = request.body;
            const tokens = await AuthService.logIn(email, password);
            response.cookie(constants.refreshCookieName, tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return response.json(tokens.accessToken);
        } catch (error) {
            return next(error);
        }
    }

    static async logOut(request, response, next) {
        try {
            const { user } = request;
            await AuthService.logOut(user?.id);
            response.clearCookie(constants.refreshCookieName);
            return response.json('OK');
        } catch (error) {
            return next(error);
        }
    }

    static async refresh(request, response, next) {
        try {
            const { refreshToken } = request.cookies;
            const tokens = await AuthService.refresh(refreshToken);
            response.cookie(constants.refreshCookieName, tokens.refreshToken, {
                // 30 days
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return response.json(tokens.accessToken);
        } catch (error) {
            return next(error);
        }
    }
}

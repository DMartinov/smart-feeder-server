import { validationResult } from 'express-validator';
import ApiError from '../exceptions/apiError';
import UserService from '../services/userService';

export default class UserController {
    static async sendRegistrationLink(request, response, next) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        const { email } = request.body;
        try {
            await UserService.sendRegistrationLink(email);
            return response.json('OK');
        } catch (error) {
            return next(error);
        }
    }

    static async signUp(request, response, next) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation errors', errors.array()));
            }

            const { activationId, password, name } = request.body;
            const tokens = await UserService.signUp({ activationId, password, name });
            return response.json(tokens);
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
            const tokens = await UserService.logIn(email, password);
            response.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return response.json(tokens.accessToken);
        } catch (error) {
            return next(error);
        }
    }

    static async logOut(request, response, next) {
        try {
            const { user } = request;
            await UserService.logOut(user?.id);
            return response.json('OK');
        } catch (error) {
            return next(error);
        }
    }

    static async refresh(request, response, next) {
        try {
            const { refreshToken } = request.body;
            const tokens = await UserService.refresh(refreshToken);
            return response.json(tokens);
        } catch (error) {
            return next(error);
        }
    }

    // static async getUser(request, response, next) {
    //     try {
    //         const { page, pageSize } = request.body;
    //         const users = UserService.getUsers({ page, pageSize });
    //         return response.json(users);
    //     } catch (error) {
    //         return next(error);
    //     }
    // }

    static async getUsers(request, response, next) {
        try {
            const { page, pageSize } = request.body;
            const users = UserService.getUsers({ page, pageSize });
            return response.json(users);
        } catch (error) {
            return next(error);
        }
    }
}

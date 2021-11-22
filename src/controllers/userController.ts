import { validationResult } from 'express-validator';
import UserDto from '../dto/userDto';
import ApiError from '../exceptions/apiError';
import UserService from '../services/userService';
import constants from '../constants';
import { UserRole } from '../models/enums';

export default class UserController {
    static async sendRegistrationLink(request, response, next) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        const { email } = request.body;
        try {
            let newUserRole;
            let adminId = null;
            if (request.user.role === UserRole.superAdmin) {
                newUserRole = UserRole.admin;
            } else {
                newUserRole = UserRole.user;
                adminId = request.user.id;
            }

            await UserService.sendRegistrationLink(email, newUserRole, adminId);
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
            const tokens = await UserService.signUp(name, password, activationId);
            response.cookie(constants.refreshCookieName, tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return response.json(tokens.accessToken);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteUser(request, response, next) {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation errors', errors.array()));
            }

            const { id } = request.body;

            if (request.user.role === UserRole.admin) {
                const user = await UserService.getUser(id);
                if (user.adminId !== request.user.id) {
                    return next(ApiError.Forbidden());
                }
            }

            const tokens = await UserService.deleteUser(id);
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
            response.cookie(constants.refreshCookieName, tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return response.json(tokens.accessToken);
        } catch (error) {
            return next(error);
        }
    }

    static async logOut(request, response, next) {
        try {
            const { user } = request;
            await UserService.logOut(user?.id);
            response.clearCookie(constants.refreshCookieName);
            return response.json('OK');
        } catch (error) {
            return next(error);
        }
    }

    static async refresh(request, response, next) {
        try {
            const { refreshToken } = request.cookies;
            const tokens = await UserService.refresh(refreshToken);
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

    // static async getUser(request, response, next) {
    //     try {
    //         const { page, pageSize } = request.body;
    //         const users = UserService.getUsers({ page, pageSize });
    //         return response.json(users);
    //     } catch (error) {
    //         return next(error);
    //     }
    // }

    static async getUsers(request: any, response: any, next: any) {
        try {
            const { page, pageSize } = request.body;
            const adminId = request.user.role === UserRole.admin ? request.user.id : null;
            const users = await UserService.getUsers({ page, pageSize, adminId });
            const dtos = users?.map((user) => new UserDto(user));
            return response.json(dtos);
        } catch (error) {
            return next(error);
        }
    }
}

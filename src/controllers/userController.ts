import { validationResult } from 'express-validator';
import { Response, NextFunction } from 'express';
import AuthorizedRequest from '../models/authorizedRequest';
import ApiError from '../exceptions/apiError';
import UserService from '../services/userService';
import DeviceService from '../services/deviceService';
import { UserRole } from '../models/enums';
import FilterBase from '../models/filterBase';

export default class UserController {
    static async sendRegistrationLink(request: AuthorizedRequest, response: Response, next: NextFunction): Promise<any> {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        const { email, deviceId = null } = request.body;
        try {
            if (deviceId != null && request.user.role === UserRole.user) {
                const isDeviceBelongsToUser = await DeviceService.checkIfDeviceBelongsToUser(request.user.id, deviceId);
                if (!isDeviceBelongsToUser) throw ApiError.Forbidden();
            }

            await UserService.sendRegistrationLink(email, deviceId);
            return response.json('OK');
        } catch (error) {
            return next(error);
        }
    }

    static async deleteUser(request: AuthorizedRequest, response: Response, next: NextFunction): Promise<any> {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation errors', errors.array()));
            }

            const { id } = request.body;
            await UserService.deleteUser(id);
            return response.json('Ok');
        } catch (error) {
            return next(error);
        }
    }

    static async getUsers(request: AuthorizedRequest, response: Response, next: NextFunction): Promise<any> {
        try {
            const { page, pageSize } = request.body;
            const filter = new FilterBase(page, pageSize);
            const users = await UserService.getUsers(filter);
            return response.json(users);
        } catch (error) {
            return next(error);
        }
    }
}

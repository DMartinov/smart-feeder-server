import { validationResult } from 'express-validator';
import { UserRole, DeviceCommandState } from '../models/enums';
import ApiError from '../exceptions/apiError';
import DeviceService from '../services/deviceService';

export default class DeviceController {
    static async getDevices(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            let { userId } = request.body;
            const { deviceIds, page, pageSize } = request.body;

            if (request.user.role === UserRole.admin) {
                userId = request.user.id;
            }

            const devices = await DeviceService.getDevices({
                userId, deviceIds, page, pageSize,
            });
            return response.json(devices);
        } catch (error) {
            return next(error);
        }
    }

    static async updateDevice(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { id, name, deleted } = request.body;
            await DeviceService.updateDeviceInfo({ id, name, deleted });
            return response.json('OK');
        } catch (error) {
            return next(error);
        }
    }

    static async addDevice(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            let { userId } = request.body;
            const { name, login, password } = request.body;
            if (![UserRole.superAdmin].includes(request.user.role)) {
                userId = request.user.id;
            }

            const device = await DeviceService.addDevice({
                userId, name, login, password,
            });
            return response.json(device);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteDevice(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { id } = request.body;
            const isSuperAdmin = request.user.role !== UserRole.superAdmin;
            const isDeviceAssignedToUser = request.user.devices.includes(id);
            if (!isSuperAdmin && !isDeviceAssignedToUser) {
                return next(ApiError.Forbidden());
            }

            await DeviceService.deleteDevice(id);
            return response.json('Ok');
        } catch (error) {
            return next(error);
        }
    }

    static async updateDeviceState(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const {
                id, status, message, charge, feed, water, commandState,
            } = request.body;
            await DeviceService.updateDeviceState({
                id, status, message, charge, feed, water, commandState,
            });
            return response.json('OK');
        } catch (error) {
            return next(error);
        }
    }

    static async setCommand(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { id, command } = request.body;
            const device = await DeviceService.getById(id);

            if (device.commandState === DeviceCommandState.inProgress) {
                const error = {
                    msg: "New command can't be set until the previous in progress",
                    param: 'command',
                };
                return next(ApiError.BadRequest('Validation errors', [error]));
            }

            await DeviceService.setCommand({ id, command });
            return response.json('OK');
        } catch (err) {
            return next(err);
        }
    }
}

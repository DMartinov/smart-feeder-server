import { validationResult } from 'express-validator';
import { userRole, deviceCommandState } from '../models/types';
import ApiError from '../exceptions/apiError';
import DeviceService from '../services/deviceService';

export default class DeviceController {
    static async getDevices(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const {
                userId, deviceIds, page, pageSize,
            } = request.body;
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
            const { name } = request.body;
            if (request.user.role !== userRole.admin) {
                userId = request.user.id;
            }

            const device = await DeviceService.addDevice({ userId, name });
            return response.json(device);
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

            if (device.commandState === deviceCommandState.inProgress) {
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

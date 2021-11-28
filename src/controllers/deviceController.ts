import { validationResult } from 'express-validator';
import { UserRole, DeviceCommandState } from '../models/enums';
import ApiError from '../exceptions/apiError';
import DeviceService from '../services/deviceService';
import DeviceFilter from '../models/devicesFilter';
import NewDevice from '../models/newDevice';
import { IDeviceState } from '../models/data/device';

export default class DeviceController {
    static async getDevices(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            let { userId } = request.body;
            const { deviceIds, page, pageSize } = request.body;

            if (request.user.role === UserRole.user) {
                userId = request.user.id;
            }

            const deviceFilter = new DeviceFilter(userId, deviceIds, page, pageSize);

            const devices = await DeviceService.getDevices(deviceFilter);
            return response.json(devices);
        } catch (error) {
            return next(error);
        }
    }

    static async updateDeviceName(request: any, response: any, next: (arg0: ApiError) => any) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { id, name } = request.body;
            await DeviceService.updateDeviceName(id, name);
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

            const newDeviceRequest = new NewDevice(userId, name, login, password);
            const device = await DeviceService.addDevice(newDeviceRequest);
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
            if (!isSuperAdmin) {
                const isDeviceAssignedToUser = DeviceService.checkIfDeviceBelongsToUser(request.user.id, id);
                if (!isDeviceAssignedToUser) {
                    return next(ApiError.Forbidden());
                }
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

            const deviceState: IDeviceState = {
                status, message, charge, feed, water, commandState,
            };

            await DeviceService.updateDeviceState(id, deviceState);
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

            await DeviceService.setCommand(id, command);
            return response.json('OK');
        } catch (err) {
            return next(err);
        }
    }
}

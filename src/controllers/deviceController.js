import { validationResult } from 'express-validator';
import { userRole, deviceCommandState } from '../models/types.js';
import ApiError from '../exceptions/apiError.js';

export default class DeviceController {
    #deviceService;

    constructor(deviceService) {
        this.#deviceService = deviceService;
    }

    async getDevices(request, response) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { userId, deviceIds, page, pageSize } = request.body;
            const devices = await this.#deviceService.getDevices({ userId, deviceIds, page, pageSize });
            return response.json(devices);
        } catch (error) {
            next(error);
        }
    }

    async updateDevice(request, response) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { id, name, deleted } = request.body;
            await this.#deviceService.updateDevice({ id, name, deleted });
            return response.json('OK');
        } catch (error) {
            next(error);
        }
    }

    async addDevice(request, response) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { userId, name } = request.body;
            if (request.user.role != userRole.admin) {
                userId = request.user.id;
            }

            const device = await this.#deviceService.addDevice({ userId, name });
            return response.json(device);
        } catch (error) {
            next(error);
        }
    }

    async updateDeviceState(request, response) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { id, status, message, charge, feed, water, commandState } = request.body;
            await this.#deviceService.updateDeviceState({ id, status, message, charge, feed, water, commandState });
            return response.json('OK');
        } catch (error) {
            next(error);
        }
    }

    async setCommand(request, response) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation errors', errors.array()));
        }

        try {
            const { id, command } = request.body;
            const device = await this.#deviceService.getById(id);

            if (device.commandState === deviceCommandState.inProgress) {
                const errors = [{
                    msg: "New command can't be set until the previous in progress",
                    param: "command",
                }];
                return next(ApiError.BadRequest('Validation errors', errors));
            }

            await this.#deviceService.updateDeviceState({ id, command, commandState: deviceCommandState.new });
            return response.json('OK');
        } catch (error) {
            next(error);
        }
    }
}

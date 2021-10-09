import DeviceDto from '../dto/deviceDto';
import User from '../models/user';
import Device from '../models/device';
import { deviceCommandState } from '../models/types';

export default class DeviceService {
    static async getById(id) {
        return Device.findById(id);
    }

    static async getDevices({
        userId = null, deviceIds = [], page = 0, pageSize = 20,
    }) {
        let query = Device.find({ deleted: false });
        if (userId) {
            const user = await User.findById(userId);
            // eslint-disable-next-line no-param-reassign
            deviceIds = user.devices?.map((x) => x.toString());
        }
        if (deviceIds) {
            query = query.where('_id').in(deviceIds);
        }

        const skipCount = page * pageSize;

        query = query.skip(skipCount).limit(pageSize);
        const devices = await query.exec();
        const dtos = devices?.map((device) => new DeviceDto(device));
        return dtos;
    }

    static async addDevice({ userId, name }) {
        const newDevice = await Device.create({ name });
        const user = await User.findById(userId);
        await user.devices.push(newDevice._id.toString());

        return new DeviceDto(newDevice);
    }

    static async updateDeviceInfo({ id, name, deleted = false }) {
        const device = await Device.findByIdAndUpdate(id, {
            name,
            deleted,
        });

        return device;
    }

    static async updateDeviceState({
        id, status, message, charge, feed, water, commandState,
    }) {
        const device = await Device.findByIdAndUpdate(id, {
            status,
            message,
            charge,
            feed,
            water,
            commandState,
        });

        return device;
    }

    static async setCommand({ id, command }) {
        const device = await Device.findByIdAndUpdate(id, {
            command,
            commandState: deviceCommandState.new,
        });

        return device;
    }
}

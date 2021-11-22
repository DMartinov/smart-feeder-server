import * as argon2 from 'argon2';
import DeviceDto from '../dto/deviceDto';
import User from '../models/user';
import Device from '../models/device';
import ApiError from '../exceptions/apiError';
import { DeviceCommandState, UserRole } from '../models/enums';

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
            if (!deviceIds?.length) return null;
        }
        if (deviceIds?.length) {
            query = query.where('_id').in(deviceIds);
        }

        const skipCount = page * pageSize;

        query = query.skip(skipCount).limit(pageSize);
        const devices = await query.exec();
        // const users = await User.find({ deviceIds: { $elemMatch: { $in: foundDeviceIds } } });
        const dtos = await Promise.all(devices?.map(async (device) => {
            // TODO: refactoring
            const deviceUsers = await User.find({ devices: device.id, deleted: false, role: { $ne: UserRole.device } });
            return new DeviceDto(device, deviceUsers);
        }));
        return dtos;
    }

    static async addDevice({
        userId, name, login, password,
    }) {
        // check if exists
        const candidate = await User.findOne({ email: login, deleted: false });
        if (candidate) {
            throw ApiError.BadRequest(`Device with login ${login} is already exists`);
        }

        const newDevice = await Device.create({ name });

        // create user for device
        const passwordHash = await argon2.hash(password);
        const deviceUser = await User.create({
            email: login,
            role: UserRole.device,
            adminId: userId,
            password: passwordHash,
            devices: [newDevice._id],
        });

        // add device to user
        if (userId) {
            const user = await User.findById(userId);

            if (user.devices == null) {
                await user.update({ devices: [newDevice._id] });
            } else {
                await User.findByIdAndUpdate(userId, { $push: { devices: newDevice._id } });
            }
        }

        return new DeviceDto(newDevice);
    }

    static async deleteDevice(id) {
        await Device.findByIdAndUpdate(id, { deleted: true });
        await User.updateMany({ devices: id, role: { $ne: UserRole.device } }, { $pullAll: { devices: [id] } });
        await User.updateOne({ devices: id, role: UserRole.device }, { deleted: true });
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
            commandState: DeviceCommandState.new,
        });

        return device;
    }
}

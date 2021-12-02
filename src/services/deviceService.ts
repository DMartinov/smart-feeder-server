import * as argon2 from 'argon2';
import { ObjectId } from 'mongoose';
import DeviceManager, { IDeviceManager } from '../models/data/deviceManager';
import DeviceDto from '../dto/deviceDto';
import DeviceUserDto from '../dto/deviceUserDto';
import User from '../models/data/user';
import Device, { IDevice, IDeviceState } from '../models/data/device';
import ApiError from '../exceptions/apiError';
import { DeviceCommand, DeviceCommandState, UserRole } from '../models/enums';
import DeviceFilter from '../models/devicesFilter';
import NewDevice from '../models/newDevice';

export default class DeviceService {
    static async getById(id) {
        return Device.findById(id);
    }

    static async checkIfDeviceBelongsToUser(userId: ObjectId | string, deviceId: ObjectId | string): Promise<boolean> {
        const device = await Device.findOne({ _id: deviceId, deleted: false });
        return device.ownerId.toString() === userId.toString();
    }

    static async getDevices(filter: DeviceFilter): Promise<Array<DeviceDto>> {
        let query = Device.find({ deleted: false });
        let filterDeviceIds: any = filter.deviceIds;
        if (filter.userId) {
            filterDeviceIds = (await DeviceManager.find({ userId: filter.userId, deleted: false })
                .select({ deviceId: true }))?.map((x) => x.deviceId);
            if (!filterDeviceIds?.length) return null;
        }
        if (filterDeviceIds?.length) {
            query = query.find({ _id: { $in: filterDeviceIds } });
        }

        query = query.skip(filter.skip).limit(filter.pageSize);
        const devices = await query.exec();

        // get users
        // TODO: refactor (use lookup)
        let users = null;
        let managers = null;
        const deviceIds = devices?.map((device) => device._id);
        if (deviceIds?.length) {
            managers = await DeviceManager.find({ deviceId: { $in: deviceIds }, deleted: false });
            if (managers?.length) {
                const deviceUsersIds = managers?.map((u) => u.userId);
                users = await User.find({ _id: { $in: deviceUsersIds } });
            }
        }

        const dtos = devices?.map((device) => {
            const deviceManagers = managers?.filter((deviceUser) => deviceUser.deviceId.toString() === device._id.toString());
            const deviceUserDtos = deviceManagers.map((deviceManager) => {
                const user = users.find((u) => u._id.toString() === deviceManager.userId.toString());
                return new DeviceUserDto(user, deviceManager);
            });

            return new DeviceDto(device, deviceUserDtos);
        });

        // const users = await User.find({ deviceIds: { $elemMatch: { $in: foundDeviceIds } } });
        // const dtos = await Promise.all(devices?.map(async (device) => {
        //     // TODO: refactoring
        //     const deviceUsers = await User.find({ devices: device.id, deleted: false, role: { $ne: UserRole.device } });
        //     return new DeviceDto(device, deviceUsers);
        // }));
        return dtos;
    }

    static async addDevice(device: NewDevice): Promise<DeviceDto> {
        // check if exists
        const candidate = await User.findOne({ email: device.login, deleted: false });
        if (candidate) {
            throw ApiError.BadRequest(`Device with login ${device.login} is already exists`);
        }

        // create identity for device
        const passwordHash = await argon2.hash(device.password);
        const deviceUser = await User.create({
            email: device.login,
            role: UserRole.device,
            password: passwordHash,
        });

        // create device
        const newDevice = await Device.create({
            name: device.name,
            ownerId: device.deviceOwnerId,
            userId: deviceUser._id,
        });

        // assign user as device manager
        if (device.deviceOwnerId) {
            const manager: IDeviceManager = {
                deviceId: newDevice._id,
                userId: device.deviceOwnerId,
                blocked: false,
            };
            await DeviceManager.create(manager);
        }

        return new DeviceDto(newDevice);
    }

    static async deleteDevice(id: ObjectId | string): Promise<void> {
        const device = await Device.findByIdAndUpdate(id, { deleted: true });

        // unassign managers
        await DeviceManager.updateMany({ deviceId: id }, { deleted: true });

        // delete device identity
        await User.findByIdAndUpdate(device.userId, { deleted: true });
    }

    static async setUserBlocked(deviceId: ObjectId, userId: ObjectId, blocked: boolean): Promise<void> {
        await DeviceManager.findOneAndUpdate({ deviceId, userId }, { blocked });
    }

    static async updateDeviceName(id: ObjectId | string, name: string): Promise<IDevice> {
        const device = await Device.findByIdAndUpdate(id, { name });
        return device;
    }

    static async updateDeviceState(id: ObjectId | string, state: IDeviceState): Promise<IDevice> {
        const device = await Device.findByIdAndUpdate(id, state);
        return device;
    }

    static async setCommand(id: ObjectId | string, command: DeviceCommand): Promise<IDevice> {
        const device = await Device.findByIdAndUpdate(id, {
            command,
            commandState: DeviceCommandState.new,
        });

        return device;
    }
}

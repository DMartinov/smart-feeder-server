import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongoose';
import User, { IUser } from '../models/data/user';
import DeviceManager, { IDeviceManager } from '../models/data/deviceManager';
import ApiError from '../exceptions/apiError';
import EmailService from './emailService';
import { UserRole } from '../models/enums';
import UserDto from '../dto/userDto';
import FilterBase from '../models/filterBase';

export default class UserService {
    static async sendRegistrationLink(email: string, deviceId: ObjectId | string): Promise<void> {
        let user = await User.findOne({ email, deleted: false });
        const isNewUser = user == null;
        if (isNewUser) {
            const activationId = uuid();
            await EmailService.sendActivationLink(email, activationId);
            const newUserModel: IUser = {
                email,
                activationId,
                role: UserRole.user,
                deleted: false,
            };
            user = await User.create(newUserModel);
        } else {
            if (!deviceId) {
                throw ApiError.BadRequest(`User with email ${email} is already exists`);
            }

            const deviceUser = await DeviceManager.findOne({ userId: user._id, deviceId }, { deviceId });
            if (deviceUser != null) {
                throw ApiError.BadRequest('User already has an access to the device');
            }

            EmailService.sendNewDeviceNotification(email);
        }

        if (deviceId) {
            const newDeviceManager: IDeviceManager = {
                deviceId,
                userId: user._id,
                blocked: false,
            };

            await DeviceManager.create(newDeviceManager);
        }
    }

    static async getUsers(filter: FilterBase = new FilterBase()): Promise<Array<UserDto>> {
        const users = await User.find({ deleted: false, role: { $ne: UserRole.device } })
            .skip(filter.skip).limit(filter.pageSize);
        const userIds = users?.map((user) => user._id);

        const devicesManagers = await DeviceManager.aggregate([
            { $match: { _id: { $in: userIds }, deleted: false } },
            {
                $lookup: {
                    from: 'devices',
                    localField: 'deviceId',
                    foreignField: '_id',
                    as: 'devices',
                },
            },
        ]);

        const dtos = users.map((user) => {
            const userDevices = devicesManagers.filter((manager) => manager.userId.toString() === user._id.toString())
                .map((manager) => (manager.devices));
            const userDto = new UserDto(user, userDevices);
            return userDto;
        });

        return dtos;
    }

    static async deleteUser(id: ObjectId | string): Promise<void> {
        await User.findByIdAndUpdate(id, { deleted: true });
    }
}

import { IDevice } from '../models/data/device';
import { IUser } from '../models/data/user';

/* eslint-disable no-underscore-dangle */
export default class UserDto {
    id;
    role;
    email;
    name;
    devices;

    constructor(user: IUser, devices: Array<IDevice>) {
        this.id = user._id?.toString();
        this.role = user.role;
        this.email = user.email;
        this.name = user.name;
        this.devices = devices?.map((device) => ({
            id: device._id,
            name: device.name,
        }));
    }
}

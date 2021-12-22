import { IDevice } from '../models/data/device';
import { DeviceStatus } from '../models/enums';
import DeviceUserDto from './deviceUserDto';

export default class DeviceDto {
    id: string;
    name: string;
    status: DeviceStatus;
    message: string;
    charge: number;
    feed: number;
    water: number;
    deleted: boolean;
    ownerId: string;
    users:Array<DeviceUserDto>;

    constructor(device: IDevice, users: Array<DeviceUserDto> = null) {
        this.id = device._id.toString();
        this.name = device.name;
        this.status = device.status;
        this.message = device.message;
        this.charge = device.charge;
        this.feed = device.feed;
        this.water = device.water;
        this.deleted = device.deleted;
        this.ownerId = device.ownerId?.toString();
        this.users = users;
    }
}

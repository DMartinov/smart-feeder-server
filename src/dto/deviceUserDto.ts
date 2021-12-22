import { IDeviceManager } from '../models/data/deviceManager';
import { IUser } from '../models/data/user';
import { UserRole } from '../models/enums';

export default class DeviceUserDto {
    public id: string;
    public name: string;
    public role: UserRole;
    public blocked: boolean;
    public isDeviceOwner: boolean;

    constructor(user: IUser, deviceManager: IDeviceManager) {
        this.id = user._id.toString();
        this.name = user.name;
        this.role = user.role;
        this.blocked = deviceManager.blocked;
    }
}

export default class DeviceDto {
    id;
    name;
    status;
    message;
    charge;
    feed;
    water;
    deleted;
    users;

    constructor(device, users = null) {
        this.id = device.id;
        this.name = device.name;
        this.status = device.status;
        this.message = device.message;
        this.charge = device.charge;
        this.feed = device.feed;
        this.water = device.water;
        this.deleted = device.deleted;
        this.users = users?.map((user) => ({
            id: user._id,
            name: user.name,
            role: user.role,
        }));
    }
}

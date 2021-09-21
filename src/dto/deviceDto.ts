export default class DeviceDto {
    id;
    name;
    status;
    message;
    charge;
    feed;
    water;
    logs;
    deleted;

    constructor(device) {
        this.id = device.id;
        this.name = device.name;
        this.status = device.status;
        this.message = device.message;
        this.charge = device.charge;
        this.feed = device.feed;
        this.water = device.water;
        this.logs = device.logs;
        this.deleted = device.deleted;
    }
}

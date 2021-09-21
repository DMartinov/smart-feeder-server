import DeviceDto from '../dto/deviceDto';

export default class DeviceService {
    #User;
    #Device;

    constructor(user, device) {
        this.#User = user;
        this.#Device = device;
    }

    async getById(id) {
        return this.#Device.getById(id);
    }

    async getDevices({
        userId = null, deviceIds = [], page = 0, pageSize = 20,
    }) {
        let query = this.#Device.find({ deleted: false });
        if (userId) {
            const user = await this.#User.findById(userId);
            // eslint-disable-next-line no-param-reassign
            deviceIds = user.devices.toObject();
        }
        if (deviceIds) {
            query = query.where('_id').in(deviceIds);
        }

        const skipCount = page * pageSize;

        query = query.skip(skipCount).take(pageSize);
        const devices = await query.exec();
        const dtos = devices?.map((device) => new DeviceDto(device));
        return dtos;
    }

    async addDevice({ userId, name }) {
        const newDevice = await this.#Device.create({ name });
        const user = await this.#User.findById(userId);
        await user.devices.push(newDevice._id.toString());

        return new DeviceDto(newDevice);
    }

    async updateDeviceInfo({ id, name, deleted = false }) {
        const device = await this.#Device.findByIdAndUpdate(id, {
            name,
            deleted,
        });

        return device;
    }

    async updateDeviceState({
        id, status, message, charge, feed, water, command, commandState,
    }) {
        const device = await this.#Device.findByIdAndUpdate(id, {
            status,
            message,
            charge,
            feed,
            water,
            command,
            commandState,
        });

        return device;
    }
}

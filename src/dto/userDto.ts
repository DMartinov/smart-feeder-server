/* eslint-disable no-underscore-dangle */
export default class UserDto {
    id;
    role;
    email; // TODO: remove?
    name; // TODO: remove?
    devices;

    constructor(model) {
        this.id = model._id?.toString();
        this.role = model.role;
        this.email = model.email;
        this.name = model.name;
        this.devices = model.devices?.toObject();
    }
}

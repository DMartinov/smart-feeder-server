import { IUser } from '../models/data/user';

export default class Identity {
    id;
    role;
    email;
    name;

    constructor(user: IUser) {
        this.id = user._id?.toString();
        this.role = user.role;
        this.email = user.email;
        this.name = user.name;
    }
}

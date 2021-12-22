import { IUser } from '../models/data/user';
import { UserRole } from '../models/enums';

export default class Identity implements IUserIdenity {
    id: string;
    role: UserRole;
    email: string;
    name: string;

    public get isSuperAdmin(): boolean {
        return this.role === UserRole.superAdmin;
    }

    constructor(user: IUser) {
        this.id = user._id?.toString();
        this.role = user.role;
        this.email = user.email;
        this.name = user.name;
    }
}

export interface IUserIdenity {
    id: string;
    role: UserRole;
    email: string;
    name: string;
    isSuperAdmin: boolean;
}

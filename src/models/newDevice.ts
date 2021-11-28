import { ObjectId } from 'mongoose';

export default class NewDevice {
    constructor(
        public deviceOwnerId: ObjectId | string = null,
        public name: string,
        public login: string,
        public password: string,
    ) { }
}

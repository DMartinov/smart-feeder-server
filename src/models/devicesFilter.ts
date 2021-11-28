import { ObjectId } from 'mongoose';
import FilterBase from './filterBase';

export default class DeviceFilter extends FilterBase {
    public deviceIds: Array<ObjectId | string>;
    public userId: ObjectId | string;

    constructor(userId:ObjectId | string = null, deviceIds: Array<ObjectId | string> = null, page = 0, pageSize = 20) {
        super(page, pageSize);
        this.userId = userId;
        this.deviceIds = deviceIds;
    }
}

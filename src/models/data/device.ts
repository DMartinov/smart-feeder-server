import { model, Schema, ObjectId } from 'mongoose';
import { DeviceState, DeviceCommand, DeviceCommandState } from '../enums';

const deviceSchema = new Schema<IDevice>({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: [true, 'name field is required'],
    },
    status: {
        type: String,
        enum: Object.values(DeviceState),
        default: DeviceState.offline,
    },
    command: {
        type: String,
        enum: Object.values(DeviceCommand),
    },
    commandState: {
        type: String,
        enum: Object.values(DeviceCommandState),
    },
    message: {
        type: String,
    },
    charge: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    feed: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    water: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

export interface IDevice extends IDeviceState{
    _id: ObjectId | string,
    // owner user id (device admin)
    ownerId: ObjectId | string,
    // identity user id
    userId: ObjectId | string,
    name: string,
    command: DeviceCommand,
    deleted: boolean,
}

export interface IDeviceState {
    status: string, // TODO: use enums
    message: string,
    charge: number,
    feed: number,
    water: number,
    commandState: DeviceCommandState,
}

export default model<IDevice>('devices', deviceSchema);

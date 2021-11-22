import { model, Schema } from 'mongoose';
import { DeviceState, DeviceCommand, DeviceCommandState } from './enums';

const deviceSchema = new Schema<IDevice>({
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

export interface IDevice {
    name: string,
    status: string, // TODO: use enums
    command: string,
    commandState: DeviceCommandState,
    message: string,
    charge: number,
    feed: number,
    water: number,
    deleted: boolean,
}

export default model<IDevice>('devices', deviceSchema);

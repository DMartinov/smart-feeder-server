import { Schema, model, ObjectId } from 'mongoose';

const deviceUserSchema = new Schema<IDeviceManager>({
    deviceId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'device',
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    canEditShedule: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

export interface IDeviceManager {
    deviceId: ObjectId | string,
    userId: ObjectId | string,
    blocked: boolean,
    canEditShedule?: boolean,
    deleted?: boolean,
}

export default model<IDeviceManager>('deviceUsers', deviceUserSchema);

import { model, Schema, ObjectId } from 'mongoose';
import { Portion, FeedStatus } from './enums';

const historySchema = new Schema({
    deviceId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    portion: {
        type: String,
        required: true,
        enum: Object.values(Portion),
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(FeedStatus),
    },
    manual: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
    },
    userId: {
        type: String,
    },
});

export interface IHistory {
    deviceId: ObjectId,
    date: Date,
    portion: Portion,
    status: FeedStatus,
    manual: boolean,
    message: string,
    userId: ObjectId,
}

export default model<IHistory>('history', historySchema);

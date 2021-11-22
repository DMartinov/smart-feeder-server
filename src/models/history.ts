import { Schema } from 'mongoose';
import { Portion, FeedStatus } from './enums';

export default new Schema({
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

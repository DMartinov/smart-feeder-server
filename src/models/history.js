import { Schema, ObjectId } from 'mongoose';
import { portion, feedStatus } from './types';

export default new Schema({
    deviceId: {
        type: ObjectId,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    portion: {
        type: String,
        required: true,
        enum: Object.keys(portion),
    },
    status: {
        type: String,
        required: true,
        enum: Object.keys(feedStatus),
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

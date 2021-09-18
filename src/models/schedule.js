import { Schema, ObjectId } from 'mongoose';
import { portion, scheduleType } from './types';

export default new Schema({
    deviceId: {
        type: ObjectId,
        required: true,
    },
    repeat: {
        type: String,
        enum: Object.keys(scheduleType),
        default: 'once',
    },
    date: {
        type: Date,
    },
    dateFrom: {
        type: Date,
    },
    dateTo: {
        type: Date,
    },
    portionSize: {
        type: String,
        enum: Object.keys(portion),
        default: portion.medium,
    },
    active: {
        type: Boolean,
        defaulf: false,
    },
});

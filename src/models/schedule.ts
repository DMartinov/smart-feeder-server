import { Schema } from 'mongoose';
import { Portion, ScheduleType } from './enums';

export default new Schema({
    deviceId: {
        type: String,
        required: true,
    },
    repeat: {
        type: String,
        enum: Object.values(ScheduleType),
        default: ScheduleType.once,
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
        enum: Object.values(Portion),
        default: Portion.medium,
    },
    active: {
        type: Boolean,
        defaulf: false,
    },
});

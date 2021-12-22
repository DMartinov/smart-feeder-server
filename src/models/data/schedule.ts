import { Schema, model, ObjectId } from 'mongoose';
import { Portion, ScheduleType } from '../enums';

const scheduleSchema = new Schema({
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

export interface ISchedule {
    _id: ObjectId | string,
    deviceId: ObjectId,
    repeat: ScheduleType,
    date: Date,
    dateFrom: Date,
    dateTo: Date,
    portionSize: Portion,
    active: boolean,
}

export default model<ISchedule>('schedule', scheduleSchema);

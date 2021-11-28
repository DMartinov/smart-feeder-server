import { Schema } from 'mongoose';
import { LogType } from './enums';

export default new Schema({
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(LogType),
    },
    message: {
        type: String,
        required: true,
    },
});

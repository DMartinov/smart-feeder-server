import { Schema } from 'mongoose';
import { logType } from './types';

export default new Schema({
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(logType),
    },
    message: {
        type: String,
        required: true,
    },
});

import { Schema, model } from 'mongoose';
import { userRole } from './types';

export default model('users', new Schema(
    {
        email: {
            type: String,
            minLength: 8,
            maxLength: 256,
        },
        name: {
            type: String,
            maxLength: 128,
        },
        role: {
            type: String,
            enum: Object.keys(userRole),
            default: userRole.user,
        },
        password: {
            type: String,
            maxLength: 512,
        },
        devices: {
            type: [Number],
        },
        activationId: {
            type: String,
        },
        refreshToken: {
            type: String,
            maxLength: 255,
        },
    },
    { timestamps: true },
));

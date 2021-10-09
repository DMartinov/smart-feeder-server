import { Schema, model } from 'mongoose';
import { userRole } from './types';

const userSchema = new Schema<IUser>(
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
        loginAttempts: {
            type: Number,
        },
    },
    { timestamps: true },
);

export interface IUser {
    email: string,
    name: string,
    role: string,
    password: string,
    devices: Array<number>,
    activationId: string,
    refreshToken: string,
    loginAttempts: number,
}

export default model<IUser>('users', userSchema);

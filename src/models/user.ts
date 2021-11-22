import { Schema, model, ObjectId } from 'mongoose';
import { UserRole } from './enums';

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
            enum: Object.values(UserRole),
            default: UserRole.user,
        },
        adminId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        password: {
            type: String,
            maxLength: 512,
        },
        devices: {
            type: [Schema.Types.ObjectId],
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
            default: 0,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export interface IUser {
    email: string,
    name: string,
    role: UserRole,
    adminId: ObjectId,
    password: string,
    devices: Array<ObjectId>,
    activationId: string,
    refreshToken: string,
    loginAttempts: number,
    deleted: boolean,
}

export default model<IUser>('users', userSchema);

/* eslint-disable no-underscore-dangle */
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import TokenHelper from '../helpers/tokenHelper';
import UserDto from '../dto/userDto';
import ApiError from '../exceptions/apiError';
import EmailService from './emailService';
import User from '../models/user';
import constants from '../constants';
import { UserRole } from '../models/enums';
import AuthToken from '../models/authToken';

export default class UserService {
    static #getJwtTokens(user) {
        const userDto = new UserDto(user);

        return {
            accessToken: TokenHelper.generateAccessToken(userDto),
            refreshToken: TokenHelper.generateRefreshToken(userDto),
        };
    }

    static async sendRegistrationLink(email: string, newUserRole: UserRole, adminId: string): Promise<void> {
        const candidate = await User.findOne({ email, deleted: false });
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} is already exists`);
        }

        const activationId = uuid();
        await EmailService.sendActivationLink({ email, activationId });
        await User.create({
            email, activationId, role: newUserRole, adminId,
        });
    }

    static async signUp(name: string, password: string, activationId: string): Promise<AuthToken> {
        const user = await User.findOne({ activationId });

        if (!user) {
            throw ApiError.BadRequest('Wrong activation link');
        }

        if (user.password) {
            throw ApiError.BadRequest('User has already been signed up');
        }

        const passwordHash = await argon2.hash(password);

        const { accessToken, refreshToken } = UserService.#getJwtTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken, password: passwordHash, name });

        return new AuthToken(accessToken, refreshToken);
    }

    static async logIn(email: string, password:string): Promise<AuthToken> {
        const user = await User.findOne({ email, deleted: false });

        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        if (user.loginAttempts > constants.maxLoginFailedAttempts) {
            await User.findByIdAndUpdate(user._id, { loginAttempts: user.loginAttempts + 1 });
            throw ApiError.BadRequest('User blocked due to max failed login attempts exceeded');
        }

        const isCorrectPassword = await argon2.verify(user.password, password);

        if (!isCorrectPassword) {
            await User.findByIdAndUpdate(user._id, { loginAttempts: user.loginAttempts + 1 });
            throw ApiError.BadRequest('User not found');
        }

        const { accessToken, refreshToken } = UserService.#getJwtTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken, loginAttempts: 0 });

        return new AuthToken(accessToken, refreshToken);
    }

    static async logOut(userId: string): Promise<void> {
        if (!userId) {
            throw ApiError.BadRequest('User not found');
        }

        await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    static async refresh(refreshToken: string): Promise<AuthToken> {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = TokenHelper.validateRefreshToken(refreshToken);
        if (userData == null) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findById(userData.payload.id);
        if (!user || user.refreshToken !== refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const newTokens = UserService.#getJwtTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken: newTokens.refreshToken });

        return new AuthToken(newTokens.accessToken, newTokens.refreshToken);
    }

    static async getUser(id) {
        const user = await User.findById(id);
        return user;
    }

    static async getUsers({ page = 0, pageSize = 20, adminId = null }) {
        let query = User.find({ deleted: false, role: { $ne: UserRole.device } });
        if (adminId !== null) {
            query = query.find({ adminId });
        }

        const skipCount = page * pageSize;
        const result = await query.skip(skipCount).limit(pageSize);
        return result;
    }

    static async deleteUser(id) {
        await User.findByIdAndUpdate(id, { deleted: true });
    }
}

/* eslint-disable no-underscore-dangle */
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { userRole } from '../models/types';
import TokenHelper from '../helpers/tokenHelper';
import UserDto from '../dto/userDto';
import ApiError from '../exceptions/apiError';
import emailService from './emailService';
import User from '../models/user';

export default class UserService {
    static #getJwtTokens(user) {
        const userDto = new UserDto(user);

        return {
            accessToken: TokenHelper.generateAccessToken(userDto),
            refreshToken: TokenHelper.generateRefreshToken(userDto),
        };
    }

    static async sendRegistrationLink(email) {
        const candidate = await User.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} is already exists`);
        }

        const activationId = uuid();
        await emailService.sendActivationLink({ email, activationId });
        const user = await User.create({ email, activationId, role: userRole.user });
        return user;
    }

    static async signUp({ name, password, activationId }) {
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

        return {
            accessToken,
            refreshToken,
        };
    }

    static async logIn(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        const isCorrectPassword = await argon2.verify(user.password, password);

        if (!isCorrectPassword) {
            throw ApiError.BadRequest('User not found');
        }

        const { accessToken, refreshToken } = UserService.#getJwtTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        return {
            accessToken,
            refreshToken,
        };
    }

    static async logOut(userId) {
        if (!userId) {
            throw ApiError.BadRequest('User not found');
        }

        await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    static async refresh(refreshToken) {
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

        return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
        };
    }

    // static async getUser(id) {
    //     const user = await User.findById(id);
    //     const dto = new UserDto(user);
    //     return dto;
    // }

    static async getUsers({ page = 0, pageSize = 20 }) {
        return { page, pageSize };
    }
}

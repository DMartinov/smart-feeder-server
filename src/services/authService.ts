import * as argon2 from 'argon2';
import TokenHelper from '../helpers/tokenHelper';
import UserDto from '../dto/userDto';
import ApiError from '../exceptions/apiError';
import User, { IUser } from '../models/data/user';
import constants from '../constants';
import AuthToken from '../models/authToken';
import Identity from '../dto/identity';

export default class AuthService {
    static #createAuthToken(user: IUser): AuthToken {
        const identity = new Identity(user);

        return new AuthToken(TokenHelper.generateAccessToken(identity), TokenHelper.generateRefreshToken(identity));
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

        const { accessToken, refreshToken } = AuthService.#createAuthToken(user);

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

        const { accessToken, refreshToken } = AuthService.#createAuthToken(user);

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

        const newTokens = AuthService.#createAuthToken(user);

        await User.findByIdAndUpdate(user._id, { refreshToken: newTokens.refreshToken });

        return new AuthToken(newTokens.accessToken, newTokens.refreshToken);
    }
}

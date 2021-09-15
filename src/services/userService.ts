import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { userRole } from '../models/types';
import TokenHelper from '../helpers/tokenHelper';
import UserDto from '../dto/userDto';
import ApiError from '../exceptions/apiError';

export default class UserService {
    #User;
    #emailService;

    constructor(userModel, emailService) {
        this.#User = userModel;
        this.#emailService = emailService;
    }

    #getJwtTokens(user) {
        const userDto = new UserDto(user);

        return {
            accessToken: TokenHelper.generateAccessToken(userDto),
            refreshToken: TokenHelper.generateRefreshToken(userDto),
        };
    }

    async sendRegistrationLink(email) {
        const candidate = await this.#User.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} is already exists`);
        }

        const activationId = uuid();
        await this.#emailService.sendActivationLink({ email, activationId })
        const user = await this.#User.create({ email, activationId, role: userRole.user });
        return user;
    }

    async signUp({ name, password, activationId }) {
        const user = await this.#User.findOne({ activationId });

        if (!user) {
            throw ApiError.BadRequest('Wrong activation link');
        }

        if (user.password) {
            throw ApiError.BadRequest('User has already been signed up');
        }

        const passwordHash = await argon2.hash(password);

        const { accessToken, refreshToken } = this.#getJwtTokens(user);

        await this.#User.findByIdAndUpdate(user._id, { refreshToken, password: passwordHash, name });

        return {
            accessToken,
            refreshToken,
        };
    }

    async logIn(email, password) {
        const user = await this.#User.findOne({ email });

        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        const isCorrectPassword = await argon2.verify(user.password, password);
        if (!isCorrectPassword) {
            throw ApiError.BadRequest('User not found');
        }

        const { accessToken, refreshToken } = this.#getJwtTokens(user);

        await this.#User.findByIdAndUpdate(user._id, { refreshToken });

        return {
            accessToken,
            refreshToken,
        };
    }

    async logOut(userId) {
        if (!userId) {
            throw ApiError.BadRequest('User not found');
        }

        await this.#User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = TokenHelper.validateRefreshToken(refreshToken);
        if (userData == null) {            
            throw ApiError.UnauthorizedError();
        }

        const user = await this.#User.findById(userData.payload.id);
        if (!user || user.refreshToken != refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const newTokens = this.#getJwtTokens(user);

        await this.#User.findByIdAndUpdate(user._id, { refreshToken: newTokens.refreshToken });

        return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
        };  
    }

    async getUser(id) {

    }

    async getUsers({ page = 0, pageSize = 20 }) {
        
    }
}

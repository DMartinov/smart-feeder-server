import { validationResult } from 'express-validator';
import ApiError from '../exceptions/apiError';

export default class UserController {
  #userService;

  constructor(userService) {
      this.#userService = userService;
  }

  async sendRegistrationLink(request, response, next) {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
          return next(ApiError.BadRequest('Validation errors', errors.array()));
      }

      const { email } = request.body;
      try {
          await this.#userService.sendRegistrationLink(email);
          return response.json('OK');
      } catch (error) {
          return next(error);
      }
  }

  async signUp(request, response, next) {
      try {
          const errors = validationResult(request);
          if (!errors.isEmpty()) {
              return next(ApiError.BadRequest('Validation errors', errors.array()));
          }

          const { activationId, password, name } = request.body;
          const tokens = await this.#userService.signUp({ activationId, password, name });
          return response.json(tokens);
      } catch (error) {
          return next(error);
      }
  }

  async logIn(request, response, next) {
      try {
          const errors = validationResult(request);
          if (!errors.isEmpty()) {
              return next(ApiError.BadRequest('Validation errors', errors.array()));
          }

          const { email, password } = request.body;
          const tokens = await this.#userService.logIn(email, password);
          return response.json(tokens);
      } catch (error) {
          return next(error);
      }
  }

  async logOut(request, response, next) {
      try {
          const { user } = request;
          await this.#userService.logOut(user?.id);
          return response.json('OK');
      } catch (error) {
          return next(error);
      }
  }

  async refresh(request, response, next) {
      try {
          const { refreshToken } = request.body;
          const tokens = await this.#userService.refresh(refreshToken);
          return response.json(tokens);
      } catch (error) {
          return next(error);
      }
  }

  async getUsers(request, response, next) {
      try {
          const { page, pageSize } = request.body;
          const users = this.#userService.getUsers({ page, pageSize });
          return response.json(users);
      } catch (error) {
          return next(error);
      }
  }
}

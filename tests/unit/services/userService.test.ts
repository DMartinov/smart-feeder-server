import UserService from '../../../src/services/userService';
import User from '../../../src/models/data/user';
import { userRole } from '../../../src/models/types';
import { jest } from '@jest/globals';
// import db from '../../db';

/**
 * Connect to a new in-memory database before running any tests.
 */
// beforeAll(async () => await db.connect());

/**
 * Clear all test data after every test.
 */
// afterEach(async () => await db.clearDatabase());

/**
 * Remove and close the db and server.
 */
// afterAll(async () => await db.closeDatabase());

const sendActivationLinkStub = jest.fn();

const emailServiceStub = {
    sendActivationLink: sendActivationLinkStub.toString,
};

const userService = new UserService(User, emailServiceStub);

describe('userService', () => {
    it('sendRegistrationLink - pass', async () => {
        const email = 'test@test.com';
        const user = await userService.sendRegistrationLink(email);
        expect(user.email).toBe(email);
        expect(user.activationId).not.toBeNull();
        expect(user.role).toBe(userRole.user);
        expect(emailServiceStub).toHaveBeenCalledTimes(1);
    });
});
import Router from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController';
import UserService from '../services/userService';
import EmailService from '../services/emailService';
import User from '../models/user';
import authMiddleware from '../middleware/authMiddleware';
import roleRequiredMiddleware from '../middleware/roleRequiredMiddleware';
import { userRole } from '../models/types';
import utils from '../helpers/utils';

const router = new Router();
const userController = new UserController(new UserService(User, new EmailService()));
utils.bindAll(userController);

router.post('/sendregistrationlink',
    authMiddleware,
    body('email').isEmail(),
    userController.sendRegistrationLink);

router.post('/signup',
    body('activationId').isUUID(),
    body('password').isStrongPassword(),
    body('name').isLength({ min: 3, max: 30 }),
    userController.signUp);

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({ max: 20 }),
    userController.logIn);

router.post('/refresh', userController.refresh);
router.get('/logout', authMiddleware, userController.logOut);
router.get('/users', authMiddleware, roleRequiredMiddleware(userRole.admin), userController.getUsers);

export default router;

import Router from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController.js';
import UserService from '../services/userService.js';
import EmailService from '../services/emailService.js';
import User from '../models/user.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleRequiredMiddleware from '../middleware/roleRequiredMiddleware.js';
import { userRole } from '../models/types.js';

const router = new Router();
const userController = new UserController(new UserService(User, new EmailService()));

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

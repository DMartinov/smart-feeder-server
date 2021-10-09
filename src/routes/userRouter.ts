import Router from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import roleRequiredMiddleware from '../middleware/roleRequiredMiddleware';
import { userRole } from '../models/types';

const router = new Router();

router.post('/sendregistrationlink',
    authMiddleware,
    body('email').isEmail(),
    UserController.sendRegistrationLink);

router.post('/signup',
    body('activationId').isUUID(),
    body('password').isStrongPassword(),
    body('name').isLength({ min: 3, max: 30 }),
    UserController.signUp);

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({ max: 20 }),
    UserController.logIn);

router.post('/refresh', UserController.refresh);
router.get('/logout', authMiddleware, UserController.logOut);
router.get('/users', authMiddleware, roleRequiredMiddleware(userRole.admin), UserController.getUsers);

export default router;

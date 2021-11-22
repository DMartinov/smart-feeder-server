import Router from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import roleRequiredMiddleware from '../middleware/roleRequiredMiddleware';
import { UserRole } from '../models/enums';

const router = new Router();

router.post('/sendregistrationlink',
    authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.admin]),
    body('email').isEmail(),
    UserController.sendRegistrationLink);

router.post('/signup',
    body('activationId').isUUID(),
    body('password').isStrongPassword().withMessage('The password is too weak'),
    body('name').isLength({ min: 3, max: 30 }),
    UserController.signUp);

router.post('/login',
    body('email').isLength({ max: 100 }),
    body('password').isLength({ max: 20 }),
    UserController.logIn);

router.get('/refresh', UserController.refresh);
router.get('/logout', authMiddleware, UserController.logOut);
router.get('/getUsers', authMiddleware, roleRequiredMiddleware([UserRole.superAdmin, UserRole.admin]), UserController.getUsers);
router.post('/delete', authMiddleware, roleRequiredMiddleware([UserRole.superAdmin, UserRole.admin]), UserController.deleteUser);

export default router;

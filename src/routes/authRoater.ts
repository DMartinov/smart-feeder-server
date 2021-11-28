import Router from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware';
import AuthController from '../controllers/authController';

const router = new Router();

router.post('/signup',
    body('activationId').isUUID(),
    body('password').isStrongPassword().withMessage('The password is too weak'),
    body('name').isLength({ min: 3, max: 30 }),
    AuthController.signUp);

router.post('/login',
    body('email').isLength({ max: 100 }),
    body('password').isLength({ max: 20 }),
    AuthController.logIn);

router.get('/refresh', AuthController.refresh);
router.get('/logout', authMiddleware, AuthController.logOut);

export default router;

import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import roleRequiredMiddleware from '../middleware/roleRequiredMiddleware';
import { UserRole } from '../models/enums';

const router = express.Router();

router.post('/sendregistrationlink',
    authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.user]),
    body('email').isEmail(),
    UserController.sendRegistrationLink);

router.get('/get-users', authMiddleware, roleRequiredMiddleware([UserRole.superAdmin]), UserController.getUsers);
router.post('/delete', authMiddleware, roleRequiredMiddleware([UserRole.superAdmin]), UserController.deleteUser);

export default router;

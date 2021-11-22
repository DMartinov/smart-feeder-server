import Router from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware';
import roleRequiredMiddleware from '../middleware/roleRequiredMiddleware';
import DeviceController from '../controllers/deviceController';
import { UserRole } from '../models/enums';

const router = new Router();

router.get('/getDevices', authMiddleware, DeviceController.getDevices);
router.post('/add',
    authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.admin]),
    body('name').isLength({ min: 3, max: 30 }),
    body('login').isLength({ max: 100 }),
    body('password').isLength({ max: 20 }),
    DeviceController.addDevice);
router.post('/update');
router.post('/delete',
    authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.admin]),
    body('id').isString(),
    DeviceController.deleteDevice);

export default router;

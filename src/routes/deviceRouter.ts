import express from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware';
import roleRequiredMiddleware from '../middleware/roleRequiredMiddleware';
import DeviceController from '../controllers/deviceController';
import { UserRole } from '../models/enums';

const router = express.Router();

router.get('/getDevices', authMiddleware, DeviceController.getDevices);

router.post('/add',
    authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.user]),
    body('name').isLength({ min: 3, max: 30 }),
    body('login').isLength({ min: 8, max: 100 }),
    body('password').isLength({ max: 20 }),
    DeviceController.addDevice);

router.post('/update-name', authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.user]),
    body('name').isLength({ min: 3, max: 30 }),
    DeviceController.updateDeviceName);

router.post('/delete',
    authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.user]),
    body('id').isString(),
    DeviceController.deleteDevice);

router.post('/block-user',
    authMiddleware,
    roleRequiredMiddleware([UserRole.superAdmin, UserRole.user]),
    body('deviceId').isMongoId(),
    body('userId').isMongoId(),
    body('blocked').isBoolean(),
    DeviceController.setUserBlocked);

router.post('/update-device-state',
    authMiddleware,
    roleRequiredMiddleware([UserRole.device]),
    body('deviceAuthUserId').isMongoId(),
    DeviceController.updateDeviceState);

export default router;

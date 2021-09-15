import Router from 'express';
import { body } from 'express-validator';
import DeviceController from '../controllers/deviceController.js';
import DeviceService from '../services/deviceService';
import user from '../models/user.js';
import device from '../models/device.js';

const router = new Router();
const deviceController = new DeviceController(new DeviceService(user, device));

router.get('/devices');
router.post('/update');

export default router;
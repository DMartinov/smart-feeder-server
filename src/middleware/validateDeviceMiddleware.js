import ApiError from "../exceptions/apiError.js";
import { userRole } from "../models/types.js";

export default () => {
    return (request, response, next) => {
        if (request.user.role === userRole.admin) {
            return next();
        }

        const deviceId = request.query.deviceId ?? request.body.deviceId;
        const userDevices = request.user?.devices ?? '[]';
        const userDeviceArr = JSON.parse(userDevices);

        const isDeviceBelongsToUser = userDeviceArr.includes(deviceId);
        if (isDeviceBelongsToUser) {
            return next();
        }

        return next(ApiError.Forbidden());
    };
};

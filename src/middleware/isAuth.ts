import * as jwt from 'express-jwt';

export default jwt({
    secret: process.env.JWT_SIGNATURE,
    requestProperty: 'token', // Next middleware can find what was codded in services/auth:generateToken -> 'req.token'
    // issuer: process.env.FRONTEND_ORIGIN    TODO:
});

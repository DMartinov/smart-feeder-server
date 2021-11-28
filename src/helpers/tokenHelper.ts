import jwt from 'jsonwebtoken';
import Identity from '../dto/identity';

export default class TokenHelper {
    static generateAccessToken(payload: Identity): string {
        return jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    }

    static generateRefreshToken(payload: Identity): string {
        return jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    }

    static validateAccessToken(token: string): any {
        return TokenHelper.validateToken(token, process.env.JWT_ACCESS_SECRET);
    }

    static validateRefreshToken(token: string): any {
        return TokenHelper.validateToken(token, process.env.JWT_REFRESH_SECRET);
    }

    static validateToken(token: string, secret: string): any {
        try {
            return jwt.verify(token, secret);
        } catch (e) {
            return null;
        }
    }
}

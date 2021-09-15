import jwt from 'jsonwebtoken';

class TokenHelper {
    static generateAccessToken(payload) {
        return jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    }

    static generateRefreshToken(payload) {
        return jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    }

    static validateAccessToken(token) {
        return this.validateToken(token, process.env.JWT_ACCESS_SECRET);
    }

    static validateRefreshToken(token) {
        return this.validateToken(token, process.env.JWT_REFRESH_SECRET);
    }

    static validateToken(token, secret) {
        try {
            return jwt.verify(token, secret);
        } catch (e) {
            return null;
        }
    }
}

export default TokenHelper;
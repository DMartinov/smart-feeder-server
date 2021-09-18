import User from '../models/user';

export default async (req, res, next) => {
    const decodedTokenData = req.tokenData;
    // eslint-disable-next-line no-underscore-dangle
    const userRecord = await User.findOne({ _id: decodedTokenData._id });

    req.currentUser = userRecord;

    if (!userRecord) {
        return res.status(401).end('User not found');
    }
    return next();
};

import createLogger from '../helpers/logger';
import ApiError from '../exceptions/apiError';

const logger = createLogger();

export default (error, request, response, next) => {
    if (error instanceof ApiError) {
        return response.status(error.status).json({ message: error.message, errors: error.errors });
    }

    logger.error(error);

    return response.status(500).json({ message: 'Unhandled error' });
};

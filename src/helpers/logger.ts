// TODO: add logger

export default (prefix = 'common') => ({
    info(message) {
        console.info(`${prefix}: ${message}`);
    },
    warning(message) {
        console.warn(`${prefix}: ${message}`);
    },
    error(message) {
        console.error(`${prefix}: ${message}`);
    },
});

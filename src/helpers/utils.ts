export default {
    bindAll(obj: any): any {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] == 'function') {
                // eslint-disable-next-line no-param-reassign
                obj[key] = obj[key].bind(obj);
            }
        });
    },
};

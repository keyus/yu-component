const isObject = (oj: unknown) => Object.prototype.toString.call(oj) === '[object Object]';
const formatDate = (key: string, data: Record<string, any>, format: string = 'YYYY-MM-DD') => {
    const it = data[key];
    if (Array.isArray(it) && it.length > 0) {
        data[key] = it.map((item: any) => item.format(format));
    } else {
        data[key] = it.format(format);
    }
}

export default {
    formatDate(key: string, data: Record<string, any>, format: string = 'YYYY-MM-DD') {
        if (!isObject(data)) return data;
        if (typeof key === 'string' && key in data) {
            formatDate(key, data, format);
            return data;
        }
        if (Array.isArray(key)) {
            for (const it of key) {
                if (it in data) {
                    formatDate(it, data, format);
                }
            }
            return data;
        }
        return data;
    },
    removeEmpty(data: Record<string, any>) {
        if (!isObject(data)) return data;
        Object.keys(data).forEach((key: string) => {
            if (data[key] === '' || (Array.isArray(data[key]) && data[key].toString() === '')) {
                delete data[key];
            }
        });
        return data;
    }
}
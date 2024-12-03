const isObject = (oj: unknown) => Object.prototype.toString.call(oj) === '[object Object]';

export interface QueryOptions {
    page: number;
    size: number;
    //antd 返回的sorter对像
    sorter: Record<string, any>;
    //表单值
    search: Record<string, any>;
    //传入的params
    urlParams: Record<string, any>;
}

//获取key对应的数据
export const getDataSource = <T extends Record<string, unknown>>(data: T, key: string): T[] => {
    if (Array.isArray(data)) return data;
    if (key.includes('.')) {
        const keys = key.split('.');
        let source = data;
        keys.forEach((it) => {
            if (source) {
                source = source[it] as T;
            }
        });
        if (Array.isArray(source)) {
            return source;
        }
        return [];
    }
    return data[key] as T[];
};

//描述table api 最终的参数组合方式
export const getQuery = ({ page, size, sorter = {}, search = {}, urlParams = {} }: QueryOptions): Record<string, unknown> => {
    const sort = sorter.order ? {
        orderField: sorter.field,
        isAsc: sorter.order === 'ascend',
    } : {}
    return {
        page,
        size,
        ...sort,
        ...urlParams,
        ...search
    }
}

//总数量，可以动态指定读取的Key
export const getTotal = <T extends Record<string, unknown>>(key: string, data: T,): number => {
    if (Array.isArray(data)) return 0;
    if (key.includes('.')) {
        const keys = key.split('.');
        let source: any = data;
        keys.forEach((it) => {
            if (source) {
                source = source[it] as any;
            }
        });
        return source as number;
    }
    return data[key] as number || 0;
};


const formatValue = (key: string, data: Record<string, any>, format: string = 'YYYY-MM-DD') => {
    const it = data[key];
    if (Array.isArray(it) && it.length > 0) {
        data[key] = it.map((item: any) => item.format(format));
    } else {
        data[key] = it.format(format);
    }
}

export const formatDate = (key: string, data: Record<string, any>, format: string = 'YYYY-MM-DD') => {
    if (!isObject(data)) return data;
    if (typeof key === 'string' && key in data) {
        formatValue(key, data, format);
        return data;
    }
    if (Array.isArray(key)) {
        for (const it of key) {
            if (it in data) {
                formatValue(it, data, format);
            }
        }
        return data;
    }
    return data;
}

export const removeEmpty = (data: Record<string, any>) => {
    if (!isObject(data)) return data;
    Object.keys(data).forEach((key: string) => {
        if (data[key] === '' || (Array.isArray(data[key]) && data[key].toString() === '')) {
            delete data[key];
        }
    });
    return data;
}

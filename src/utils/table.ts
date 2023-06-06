
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



export interface QueryOptions {
    page: number;
    size: number;
    //antd 返回的sorter对像
    sorter: Record<string, unknown>;
    //表单值
    search: Record<string, unknown>;
    //传入的params
    urlParams: Record<string, unknown>;
}

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

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
    return {
        page,
        size,
        orderField: sorter.orderField,
        isAsc: sorter.order === 'ascend',
        ...urlParams,
        ...search
    }
}
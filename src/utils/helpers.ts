

export default {
    // 处理antd form values  为日期的字段，格式化成字符串
    valuesDate(key: string | string[], data: Record<string, any>, dateFormat: string = 'YYYY-MM-DD'): Record<string, any> {
        const isDateArray = (value: any) => {
            return Array.isArray(value) && value.length > 0;
        }
        const format = (value: any) => {
            return value?.format(dateFormat)
        }
        if (typeof key === 'string' && key in data) {
            const value = data[key];
            data[key] = isDateArray(value) ?
                [
                    format(value[0]),
                    format(value[1])
                ] : format(value)
        }
        if (Array.isArray(key)) {
            key.forEach((item: string) => {
                const value = data[item];
                data[item] = isDateArray(value) ?
                    [
                        format(value[0]),
                        format(value[1])
                    ] : format(value)
            })
        }
        return data;
    },

    // 移除空值key或空字符串数组key
    removeEmpty(data: Record<string, any>) {
        if (typeof data !== 'object') return data;
        Object.keys(data).forEach((key: string) => {
            if (data[key] === '') return delete data[key];
            if (Array.isArray(data[key]) && data[key].toString() === '') {
                return delete data[key];
            }
        });
        return data;
    }
}
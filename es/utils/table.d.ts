export declare const getDataSource: <T extends Record<string, unknown>>(data: T, key: string) => T[];
export interface QueryOptions {
    page: number;
    size: number;
    sorter: Record<string, unknown>;
    search: Record<string, unknown>;
    urlParams: Record<string, unknown>;
}
export declare const getQuery: ({ page, size, sorter, search, urlParams }: QueryOptions) => Record<string, unknown>;
export declare const getTotal: <T extends Record<string, unknown>>(key: string, data: T) => number;

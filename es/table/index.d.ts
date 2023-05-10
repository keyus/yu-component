import * as React from 'react';
import type { FormInstance } from 'antd';
import { getQuery, QueryOptions } from '../utils/table';
import './style.css';
interface ProTableProps<T> {
    className?: string;
    tableClassName?: string;
    url: string;
    table: {
        useStore: () => {
            page: number;
            size: number;
            sorter: {
                field?: string;
                order?: 'ascend' | 'descend' | undefined;
            };
            data: Record<string, unknown> | null | undefined | any[];
            search: Record<string, unknown>;
            setState: (values: Partial<{
                page: number;
                size: number;
                sorter: {
                    field?: string;
                    order?: 'ascend' | 'descend' | undefined;
                };
                data: T;
                search: Record<string, unknown>;
            }>) => void;
        };
        run: () => void;
        refresh: () => void;
        reset: () => void;
        sortOrder: (key: string) => boolean | undefined;
        form: FormInstance;
        update: () => void;
    };
    rowKey: string | ((record: T, index: number) => string);
    dataKey?: string;
    manual?: boolean;
    nostyle?: boolean;
    params?: Record<string, unknown>;
    columns: ((data: T) => any[]) | any[];
    form?: {
        initialValues?: Record<string, unknown>;
        title?: React.ReactNode;
        items?: React.ReactNode;
        extra?: React.ReactNode;
        right?: React.ReactNode;
        handleValues?: (values: Record<string, unknown>) => Record<string, unknown>;
        className?: string;
        reset?: boolean;
    };
    rowSelection?: any;
    alert?: React.ReactNode | ((data: T) => React.ReactNode);
    toolbar?: React.ReactNode;
    pageSizeOptions?: number[];
    onBefore?: () => void;
}
declare const ProTable: {
    <T extends Record<string, unknown>>(props: ProTableProps<T>): import("react/jsx-runtime").JSX.Element;
    useTable<T_1 extends Record<string, unknown>>(options?: {
        page?: number;
        size?: number;
        sorter?: {
            field?: string;
            order?: 'ascend' | 'descend' | undefined;
        };
    }): {
        form: FormInstance;
        useStore: () => {
            page: number;
            size: number;
            sorter: {
                field?: string;
                order?: 'ascend' | 'descend' | undefined;
            };
            data: Record<string, unknown> | null | undefined | any[];
            search: Record<string, unknown>;
            setState: (values: Partial<{
                page: number;
                size: number;
                sorter: {
                    field?: string;
                    order?: 'ascend' | 'descend' | undefined;
                };
                data: T_1;
                search: Record<string, unknown>;
            }>) => void;
        };
        run: () => void;
        refresh: () => void;
        reset: () => void;
        sortOrder: (key: string) => boolean | undefined;
        update: () => void;
    }[];
    getQuery: ({ page, size, sorter, search, urlParams }: QueryOptions) => Record<string, unknown>;
    config(options?: {
        getQuery?: (data: QueryOptions) => Record<string, unknown>;
    }): void;
};
export default ProTable;

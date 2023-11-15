import * as React from 'react';
import { Table, Form, Button, Space } from 'antd';
import type { ExpandableConfig } from 'rc-table/lib/interface';
import type { FormInstance } from 'antd';
import cn from 'classnames';
import { useMount, useToggle, useUpdate, useUpdateEffect } from 'ahooks';
import { create, } from 'zustand';
import useFetch from '../hooks/useFetch';
import useX from '../hooks/useX';
import { getDataSource, getQuery, getTotal, QueryOptions } from '../utils/table';
import './style.css'

interface ProTableProps<T, RecordType = unknown> {
    className?: string;
    tableClassName?: string;
    //api url
    url: string;
    //Table.useTable()实例,  返回状态库，常用方法
    table: {
        useStore: () => {
            page: number;
            size: number;
            sorter: {
                field?: string;
                order?: 'ascend' | 'descend' | undefined | boolean;
            };
            data: Record<string, unknown> | null | undefined | any[];
            search: Record<string, unknown>;
            setState: (values: Partial<{ page: number; size: number; sorter: { field?: string; order?: 'ascend' | 'descend' | undefined }; data: T; search: Record<string, unknown> }>) => void;
        };
        //执行搜索
        run: () => void;
        //清除列表数据
        clear: () => void;
        //api 刷新会保留当前所有搜索参数
        refresh: () => void;
        //重置所有参数并搜索,仅在传入form时生效
        reset: () => void;
        //排序  table.sortOrder('列名')
        sortOrder: (key: string) => boolean | undefined;
        form: FormInstance;
        update: () => void;
    };
    rowKey: string | ((record: T, index: number) => string);
    locale?: Record<string, unknown>;
    //后端数据列表的键名，例如：'data'、'list.data'   是否 data下方开始查询 {code: 0, data: { data: [] }, message: '11'}, 默认使用的是data下方data
    dataKey?: string;
    totalKey?: string;
    //是否手动发送请求 为false时手动调用table.run();
    manual?: boolean;
    //是否不含className
    nostyle?: boolean;
    //发起请求时附加参数
    params?: Record<string, unknown>;
    //antd table columns 支持函数返回一个列数组:参数data api返回数据,  一般使用function 时用于根据data，动态生成列
    columns: ((data: T) => any[]) | any[];
    form?: {
        initialValues?: Record<string, unknown>;
        //form左侧标题
        title?: React.ReactNode;
        //form items 表单项
        items?: React.ReactNode;
        //扩展内容  放在查询，重置 后方
        extra?: React.ReactNode;
        //表单右侧ui
        right?: React.ReactNode;
        //onfinish完成后处理表单值,必需返回值,如果返回false, 则后续不再执行
        handleValues?: (values: Record<string, unknown>) => Record<string, unknown>;
        className?: string;
        //是否在点击重置按钮后自动提交表单重新搜索，默认true
        reset?: boolean;
    };
    rowSelection?: any;
    expandable?: ExpandableConfig<RecordType>;
    //统计提示
    alert?: React.ReactNode | ((data: T) => React.ReactNode);
    //操作按钮组,独立成一行
    toolbar?: React.ReactNode;
    pageSizeOptions?: number[];
    //发送请求前
    onBefore?: () => void;
}

const ProTable = <T extends Record<string, unknown>>(props: ProTableProps<T>) => {
    const {
        className = 'main-container',
        tableClassName = 'main-table',
        table,
        rowKey,
        locale,
        dataKey = 'data',
        totalKey = 'total',
        manual = false,
        nostyle,
        url,
        params: urlParams,
        columns,
        form = {},
        rowSelection,
        alert,
        toolbar = null,
        expandable,
        pageSizeOptions = [10, 20, 50, 100],
        onBefore,
    } = props;

    const wrapperClass = cn({
        [className]: !nostyle,
    })
    const formClass = cn('search-form', {
        [form.className]: form.className,
    })
    const tableClass = cn('search-form', {
        [tableClassName]: tableClassName,
    })

    const [ready, { toggle }] = useToggle();
    const { page, size, sorter, search, setState } = table.useStore();

    const { data = {}, loading, mutate } = useFetch(url, {
        onBefore: onBefore as () => void,
        data: ProTable.getQuery({
            page,
            size,
            sorter,
            search,
            urlParams,
        }),
        ready,
        onFinally: toggle,
        onSuccess(data: any) {
            setState({
                data,
            });
        },
        loadingDelay: 300,
    });


    const { dataSource, total, column, alertRender } = React.useMemo(() => {
        return {
            column: typeof columns === 'function' ? columns(data as any) : columns,
            dataSource: getDataSource<T>(data as any, dataKey),
            alertRender: typeof alert === 'function' ? alert(data as any) : alert,
            total: getTotal(totalKey, data)
        };
    }, [columns, data, dataKey, totalKey]);

    const onSearch = () => {
        if (form.items) {
            table.form.submit();
        } else {
            toggle();
        }
    };
    const onReset = () => {
        setState({
            size: 10,
            sorter: {},
        });

        if (form.items) {
            table.form.resetFields();
            if (form.reset === undefined || form.reset === true) {
                table.form.submit();
            }
        }
    };

    if (table) {
        table.run = onSearch;
        table.clear = () => mutate({});
        table.refresh = toggle;
        table.reset = () => {
            if (form.items) {
                onReset();
            }
        };
    }

    useUpdateEffect(() => {
        table.update();
    }, [sorter]);

    useMount(() => {
        if (manual) return;
        if (form.items) {
            table.form.submit();
        } else {
            toggle();
        }
    });

    const onFinish = (values: Record<string, unknown>) => {
        if (form.handleValues) {
            values = form.handleValues(values);
        }
        if (!values) return;
        setState({
            page: 1,
            search: values,
        });
        toggle();
    };

    const tableChange = (pagination: any, sorter: any) => {
        setState({
            page: pagination.current,
            size: pagination.pageSize,
            sorter,
        });
        toggle();
    };
    const x = useX(column);

    return (
        <div className={wrapperClass}>
            {form.items && (
                <div
                    className={formClass}
                    style={{ display: 'flex', justifyContent: 'space-between', }}
                >
                    <Form
                        initialValues={form.initialValues as any}
                        form={table.form}
                        layout="inline"
                        onFinish={onFinish}>
                        {form.title && <Form.Item>{form.title}</Form.Item>}
                        {form.items}
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={onReset}>重置</Button>
                                {form.extra}
                            </Space>
                        </Form.Item>
                    </Form>
                    {form.right}
                </div>
            )}
            <div className={tableClass}>
                {toolbar && <div className="toolbar">{toolbar}</div>}
                {alertRender}
                <Table
                    columns={column}
                    loading={loading}
                    scroll={{ x }}
                    locale={locale}
                    rowKey={rowKey as any}
                    expandable={expandable}
                    rowSelection={rowSelection}
                    onChange={(p, _, sorter) => tableChange(p, sorter)}
                    pagination={{
                        current: page,
                        pageSize: size,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions,
                        total,
                        showTotal(total) {
                            return `共 ${total} 条记录`;
                        },
                    }}
                    dataSource={dataSource}
                />
            </div>
        </div>
    );
};

ProTable.useTable = <T extends Record<string, unknown>>(options: {
    page?: number;
    size?: number;
    sorter?: {
        field?: string;
        order?: 'ascend' | 'descend' | undefined | boolean;
    };
} = {}) => {
    const update = useUpdate();
    const [form] = Form.useForm();
    const tableRef = React.useRef<{
        form: FormInstance;
        useStore: () => {
            page: number;
            size: number;
            sorter: {
                field?: string;
                order?: 'ascend' | 'descend' | undefined | boolean;
            };
            data: Record<string, unknown> | null | undefined | any[];
            search: Record<string, unknown>;
            setState: (values: Partial<{ page: number; size: number; sorter: { field?: string; order?: 'ascend' | 'descend' | undefined }; data: T; search: Record<string, unknown> }>) => void;
        };
        run: () => void;
        clear: () => void;
        refresh: () => void;
        reset: () => void;
        sortOrder: (key: string) => boolean | undefined;
        update: () => void;
    }>();
    if (!tableRef.current) {
        const useStore = create((set) => ({
            page: options.page ?? 1,
            size: options.size ?? 10,
            sorter: options.sorter || {}, //排序
            search: {}, //form values
            data: {}, //数据
            setState(values = {}) {
                set(values);
            },
        }));
        tableRef.current = {
            form,
            useStore: useStore as any, //使用usestore 获取page,size,data,search， antd 
            run() { },
            clear() { },
            refresh: () => { },
            reset: () => { },
            sortOrder(key) {
                const sorter = (useStore as any).getState().sorter;
                return sorter.field === key && sorter.order;
            },
            update,
        };
    }
    return [tableRef.current];
};

ProTable.getQuery = getQuery;

//自定义配置参数组合方式.  默认提供 page,size，orderField，isAsc，...urlParams,...search
ProTable.config = (options: { getQuery?: (data: QueryOptions) => Record<string, unknown> } = {}) => {
    if (options.getQuery) {
        ProTable.getQuery = options.getQuery;
    }
}

export default ProTable;
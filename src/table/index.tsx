import { useRef, useMemo } from 'react';
import cn from 'classnames';
import type { ProTableProps, UseTableProps, TableRef, TableState, } from './types';
import { Table, Form, Button, Space } from 'antd';
import { useMount, useToggle, useUpdate, useUpdateEffect } from 'ahooks';
import { create, } from 'zustand';
import useFetch from '../hooks/useFetch';
import useX from '../hooks/useX';
import { getDataSource, getQuery, getTotal, QueryOptions, formatDate, removeEmpty } from '../utils/table';
import './style.css'

const ProTable = <T extends Record<string, any>>(props: ProTableProps<T>) => {
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
        pagination,
        loadingDelay = 300,
        method,
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
        method,
        onBefore,
        json: ProTable.getQuery({
            page,
            size,
            sorter,
            search,
            urlParams,
        }),
        ready,
        onFinally: toggle,
        onSuccess(data) {
            setState({
                data,
            });
        },
        loadingDelay,
    });

    const { dataSource, total, column, alertRender } = useMemo(() => {
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
            if (form.onResetBefore && form.onResetBefore() === false) return;
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
                        showQuickJumper: pagination ? pagination.showQuickJumper : true,
                        showSizeChanger: pagination ? pagination.showSizeChanger : true,
                        hideOnSinglePage: pagination ? pagination.hideOnSinglePage : false,
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

ProTable.useTable = (options: UseTableProps = {}) => {
    const update = useUpdate();
    const [form] = Form.useForm();
    const tableRef = useRef<TableRef>(null);
    if (!tableRef.current) {
        const useStore = create<TableState<any>>((set) => ({
            page: options.page ?? 1,
            size: options.size ?? 10,
            sorter: options.sorter || {},
            search: {},
            data: {},
            setState(values = {}) {
                set(values);
            },
        }));
        tableRef.current = {
            form,
            //使用usestore 获取page,size,data,search， antd 
            useStore: useStore,
            run() { },
            clear() { },
            refresh: () => { },
            reset: () => { },
            sortOrder(key: string) {
                const sorter = useStore.getState().sorter;
                if (sorter && sorter.field === key) {
                    return sorter.order;
                }
                return null
            },
            update,
        };
    }
    return [tableRef.current];
};

ProTable.getQuery = getQuery;
ProTable.formatDate = formatDate;
ProTable.removeEmpty = removeEmpty;
//自定义配置参数组合方式.  默认提供 page,size，orderField，isAsc，...urlParams,...search
ProTable.config = (options: { getQuery?: (data: QueryOptions) => Record<string, unknown> } = {}) => {
    if (options.getQuery) {
        ProTable.getQuery = options.getQuery;
    }
}



export default ProTable;
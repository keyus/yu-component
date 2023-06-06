import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as React from 'react';
import { Table, Form, Button, Space } from 'antd';
import cn from 'classnames';
import { useMount, useToggle, useUpdate, useUpdateEffect } from 'ahooks';
import { create } from 'zustand';
import useFetch from "../hooks/useFetch";
import useX from "../hooks/useX";
import { getDataSource, getQuery, getTotal } from "../utils/table";
import "./style.css";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var ProTable = function ProTable(props) {
  var _props$className = props.className,
    className = _props$className === void 0 ? 'main-container' : _props$className,
    _props$tableClassName = props.tableClassName,
    tableClassName = _props$tableClassName === void 0 ? 'main-table' : _props$tableClassName,
    table = props.table,
    rowKey = props.rowKey,
    _props$dataKey = props.dataKey,
    dataKey = _props$dataKey === void 0 ? 'data' : _props$dataKey,
    _props$totalKey = props.totalKey,
    totalKey = _props$totalKey === void 0 ? 'total' : _props$totalKey,
    _props$manual = props.manual,
    manual = _props$manual === void 0 ? false : _props$manual,
    nostyle = props.nostyle,
    url = props.url,
    urlParams = props.params,
    columns = props.columns,
    _props$form = props.form,
    form = _props$form === void 0 ? {} : _props$form,
    rowSelection = props.rowSelection,
    alert = props.alert,
    _props$toolbar = props.toolbar,
    toolbar = _props$toolbar === void 0 ? null : _props$toolbar,
    _props$pageSizeOption = props.pageSizeOptions,
    pageSizeOptions = _props$pageSizeOption === void 0 ? [10, 20, 50, 100] : _props$pageSizeOption,
    onBefore = props.onBefore;
  var wrapperClass = cn(_defineProperty({}, className, !nostyle));
  var formClass = cn('search-form', _defineProperty({}, form.className, form.className));
  var tableClass = cn('search-form', _defineProperty({}, tableClassName, tableClassName));
  var _useToggle = useToggle(),
    _useToggle2 = _slicedToArray(_useToggle, 2),
    ready = _useToggle2[0],
    toggle = _useToggle2[1].toggle;
  var _table$useStore = table.useStore(),
    page = _table$useStore.page,
    size = _table$useStore.size,
    sorter = _table$useStore.sorter,
    search = _table$useStore.search,
    setState = _table$useStore.setState;
  var _useFetch = useFetch(url, {
      onBefore: onBefore,
      data: ProTable.getQuery({
        page: page,
        size: size,
        sorter: sorter,
        search: search,
        urlParams: urlParams
      }),
      ready: ready,
      onFinally: toggle,
      onSuccess: function onSuccess(data) {
        setState({
          data: data
        });
      },
      loadingDelay: 300
    }),
    _useFetch$data = _useFetch.data,
    data = _useFetch$data === void 0 ? {} : _useFetch$data,
    loading = _useFetch.loading;
  var _React$useMemo = React.useMemo(function () {
      return {
        column: typeof columns === 'function' ? columns(data) : columns,
        dataSource: getDataSource(data, dataKey),
        alertRender: typeof alert === 'function' ? alert(data) : alert,
        total: getTotal(totalKey, data)
      };
    }, [columns, data, dataKey, totalKey]),
    dataSource = _React$useMemo.dataSource,
    total = _React$useMemo.total,
    column = _React$useMemo.column,
    alertRender = _React$useMemo.alertRender;
  var onSearch = function onSearch() {
    if (form.items) {
      table.form.submit();
    } else {
      toggle();
    }
  };
  var onReset = function onReset() {
    setState({
      size: 10,
      sorter: {}
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
    table.refresh = toggle;
    table.reset = function () {
      if (form.items) {
        onReset();
      }
    };
  }
  useUpdateEffect(function () {
    table.update();
  }, [sorter]);
  useMount(function () {
    if (manual) return;
    if (form.items) {
      table.form.submit();
    } else {
      toggle();
    }
  });
  var onFinish = function onFinish(values) {
    if (form.handleValues) {
      values = form.handleValues(values);
    }
    if (!values) return;
    setState({
      page: 1,
      search: values
    });
    toggle();
  };
  var tableChange = function tableChange(pagination, sorter) {
    setState({
      page: pagination.current,
      size: pagination.pageSize,
      sorter: sorter
    });
    toggle();
  };
  var x = useX(column);
  return /*#__PURE__*/_jsxs("div", {
    className: wrapperClass,
    children: [form.items && /*#__PURE__*/_jsxs("div", {
      className: formClass,
      style: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      children: [/*#__PURE__*/_jsxs(Form, {
        initialValues: form.initialValues,
        form: table.form,
        layout: "inline",
        onFinish: onFinish,
        children: [form.title && /*#__PURE__*/_jsx(Form.Item, {
          children: form.title
        }), form.items, /*#__PURE__*/_jsx(Form.Item, {
          children: /*#__PURE__*/_jsxs(Space, {
            children: [/*#__PURE__*/_jsx(Button, {
              type: "primary",
              htmlType: "submit",
              children: "\u67E5\u8BE2"
            }), /*#__PURE__*/_jsx(Button, {
              onClick: onReset,
              children: "\u91CD\u7F6E"
            }), form.extra]
          })
        })]
      }), form.right]
    }), /*#__PURE__*/_jsxs("div", {
      className: tableClass,
      children: [toolbar && /*#__PURE__*/_jsx("div", {
        className: "toolbar",
        children: toolbar
      }), alertRender, /*#__PURE__*/_jsx(Table, {
        columns: column,
        loading: loading,
        scroll: {
          x: x
        },
        locale: {
          emptyText: '暂无数据'
        },
        rowKey: rowKey,
        rowSelection: rowSelection,
        onChange: function onChange(p, _, sorter) {
          return tableChange(p, sorter);
        },
        pagination: {
          current: page,
          pageSize: size,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: pageSizeOptions,
          total: total,
          showTotal: function showTotal(total) {
            return "\u5171 ".concat(total, " \u6761\u8BB0\u5F55");
          }
        },
        dataSource: dataSource
      })]
    })]
  });
};
ProTable.useTable = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var update = useUpdate();
  var _Form$useForm = Form.useForm(),
    _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
    form = _Form$useForm2[0];
  var tableRef = React.useRef();
  if (!tableRef.current) {
    var useStore = create(function (set) {
      var _options$page, _options$size;
      return {
        page: (_options$page = options.page) !== null && _options$page !== void 0 ? _options$page : 1,
        size: (_options$size = options.size) !== null && _options$size !== void 0 ? _options$size : 10,
        sorter: options.sorter || {},
        //排序
        search: {},
        //form values
        data: {},
        //数据
        setState: function setState() {
          var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          set(values);
        }
      };
    });
    tableRef.current = {
      form: form,
      useStore: useStore,
      //使用usestore 获取page,size,data,search， antd 
      run: function run() {},
      refresh: function refresh() {},
      reset: function reset() {},
      sortOrder: function sortOrder(key) {
        var sorter = useStore.getState().sorter;
        return sorter.field === key && sorter.order;
      },
      update: update
    };
  }
  return [tableRef.current];
};
ProTable.getQuery = getQuery;

//自定义配置参数组合方式.  默认提供 page,size，orderField，isAsc，...urlParams,...search
ProTable.config = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  if (options.getQuery) {
    ProTable.getQuery = options.getQuery;
  }
};
export default ProTable;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/table/index.tsx
var table_exports = {};
__export(table_exports, {
  default: () => table_default
});
module.exports = __toCommonJS(table_exports);
var React = __toESM(require("react"));
var import_antd = require("antd");
var import_classnames = __toESM(require("classnames"));
var import_ahooks = require("ahooks");
var import_zustand = require("zustand");
var import_useFetch = __toESM(require("../hooks/useFetch"));
var import_useX = __toESM(require("../hooks/useX"));
var import_table = require("../utils/table");
var import_style = require("./style.css");
var ProTable = (props) => {
  const {
    className = "main-container",
    tableClassName = "main-table",
    table,
    rowKey,
    dataKey = "data",
    totalKey = "total",
    manual = false,
    nostyle,
    url,
    params: urlParams,
    columns,
    form = {},
    rowSelection,
    alert,
    toolbar = null,
    pageSizeOptions = [10, 20, 50, 100],
    onBefore
  } = props;
  const wrapperClass = (0, import_classnames.default)({
    [className]: !nostyle
  });
  const formClass = (0, import_classnames.default)("search-form", {
    [form.className]: form.className
  });
  const tableClass = (0, import_classnames.default)("search-form", {
    [tableClassName]: tableClassName
  });
  const [ready, { toggle }] = (0, import_ahooks.useToggle)();
  const { page, size, sorter, search, setState } = table.useStore();
  const { data = {}, loading, mutate } = (0, import_useFetch.default)(url, {
    onBefore,
    data: ProTable.getQuery({
      page,
      size,
      sorter,
      search,
      urlParams
    }),
    ready,
    onFinally: toggle,
    onSuccess(data2) {
      setState({
        data: data2
      });
    },
    loadingDelay: 300
  });
  const { dataSource, total, column, alertRender } = React.useMemo(() => {
    return {
      column: typeof columns === "function" ? columns(data) : columns,
      dataSource: (0, import_table.getDataSource)(data, dataKey),
      alertRender: typeof alert === "function" ? alert(data) : alert,
      total: (0, import_table.getTotal)(totalKey, data)
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
      sorter: {}
    });
    if (form.items) {
      table.form.resetFields();
      if (form.reset === void 0 || form.reset === true) {
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
  (0, import_ahooks.useUpdateEffect)(() => {
    table.update();
  }, [sorter]);
  (0, import_ahooks.useMount)(() => {
    if (manual)
      return;
    if (form.items) {
      table.form.submit();
    } else {
      toggle();
    }
  });
  const onFinish = (values) => {
    if (form.handleValues) {
      values = form.handleValues(values);
    }
    if (!values)
      return;
    setState({
      page: 1,
      search: values
    });
    toggle();
  };
  const tableChange = (pagination, sorter2) => {
    setState({
      page: pagination.current,
      size: pagination.pageSize,
      sorter: sorter2
    });
    toggle();
  };
  const x = (0, import_useX.default)(column);
  return /* @__PURE__ */ React.createElement("div", { className: wrapperClass }, form.items && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: formClass,
      style: { display: "flex", justifyContent: "space-between" }
    },
    /* @__PURE__ */ React.createElement(
      import_antd.Form,
      {
        initialValues: form.initialValues,
        form: table.form,
        layout: "inline",
        onFinish
      },
      form.title && /* @__PURE__ */ React.createElement(import_antd.Form.Item, null, form.title),
      form.items,
      /* @__PURE__ */ React.createElement(import_antd.Form.Item, null, /* @__PURE__ */ React.createElement(import_antd.Space, null, /* @__PURE__ */ React.createElement(import_antd.Button, { type: "primary", htmlType: "submit" }, "查询"), /* @__PURE__ */ React.createElement(import_antd.Button, { onClick: onReset }, "重置"), form.extra))
    ),
    form.right
  ), /* @__PURE__ */ React.createElement("div", { className: tableClass }, toolbar && /* @__PURE__ */ React.createElement("div", { className: "toolbar" }, toolbar), alertRender, /* @__PURE__ */ React.createElement(
    import_antd.Table,
    {
      columns: column,
      loading,
      scroll: { x },
      locale: { emptyText: "暂无数据" },
      rowKey,
      rowSelection,
      onChange: (p, _, sorter2) => tableChange(p, sorter2),
      pagination: {
        current: page,
        pageSize: size,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions,
        total,
        showTotal(total2) {
          return `共 ${total2} 条记录`;
        }
      },
      dataSource
    }
  )));
};
ProTable.useTable = (options = {}) => {
  const update = (0, import_ahooks.useUpdate)();
  const [form] = import_antd.Form.useForm();
  const tableRef = React.useRef();
  if (!tableRef.current) {
    const useStore = (0, import_zustand.create)((set) => ({
      page: options.page ?? 1,
      size: options.size ?? 10,
      sorter: options.sorter || {},
      //排序
      search: {},
      //form values
      data: {},
      //数据
      setState(values = {}) {
        set(values);
      }
    }));
    tableRef.current = {
      form,
      useStore,
      //使用usestore 获取page,size,data,search， antd 
      run() {
      },
      clear() {
      },
      refresh: () => {
      },
      reset: () => {
      },
      sortOrder(key) {
        const sorter = useStore.getState().sorter;
        return sorter.field === key && sorter.order;
      },
      update
    };
  }
  return [tableRef.current];
};
ProTable.getQuery = import_table.getQuery;
ProTable.config = (options = {}) => {
  if (options.getQuery) {
    ProTable.getQuery = options.getQuery;
  }
};
var table_default = ProTable;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});

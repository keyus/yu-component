var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/table.ts
var table_exports = {};
__export(table_exports, {
  getDataSource: () => getDataSource,
  getQuery: () => getQuery
});
module.exports = __toCommonJS(table_exports);
var getDataSource = (data, key) => {
  if (Array.isArray(data))
    return data;
  if (key.includes(".")) {
    const keys = key.split(".");
    let source = data;
    keys.forEach((it) => {
      if (source) {
        source = source[it];
      }
    });
    if (Array.isArray(source)) {
      return source;
    }
    return [];
  }
  return data[key];
};
var getQuery = ({ page, size, sorter = {}, search = {}, urlParams = {} }) => {
  return {
    page,
    size,
    orderField: sorter.orderField,
    isAsc: sorter.order === "ascend",
    ...urlParams,
    ...search
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDataSource,
  getQuery
});

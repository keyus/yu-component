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

// src/utils/helpers.ts
var helpers_exports = {};
__export(helpers_exports, {
  default: () => helpers_default
});
module.exports = __toCommonJS(helpers_exports);
var helpers_default = {
  // 处理antd form values  为日期的字段，格式化成字符串
  valuesDate(key, data, dateFormat = "YYYY-MM-DD") {
    const isDateArray = (value) => {
      return Array.isArray(value) && value.length > 0;
    };
    const format = (value) => {
      return value == null ? void 0 : value.format(dateFormat);
    };
    if (typeof key === "string" && key in data) {
      const value = data[key];
      data[key] = isDateArray(value) ? [
        format(value[0]),
        format(value[1])
      ] : format(value);
    }
    if (Array.isArray(key)) {
      key.forEach((item) => {
        const value = data[item];
        data[item] = isDateArray(value) ? [
          format(value[0]),
          format(value[1])
        ] : format(value);
      });
    }
    return data;
  },
  // 移除空值key或空字符串数组key
  removeEmpty(data) {
    if (typeof data !== "object")
      return data;
    Object.keys(data).forEach((key) => {
      if (data[key] === "")
        return delete data[key];
      if (Array.isArray(data[key]) && data[key].toString() === "") {
        return delete data[key];
      }
    });
    return data;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});

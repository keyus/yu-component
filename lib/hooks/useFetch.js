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

// src/hooks/useFetch.ts
var useFetch_exports = {};
__export(useFetch_exports, {
  default: () => useFetch_default,
  downloadfile: () => import_fetch.downloadfile,
  http: () => http
});
module.exports = __toCommonJS(useFetch_exports);
var import_ahooks = require("ahooks");
var import_antd = require("antd");
var import_fetch = __toESM(require("../fetch"));
var defaultOptions = {
  baseUrl: "/api",
  successfulStatusCode: [200],
  logoutStatusCodes: [401, 402],
  silentErrorCodes: [],
  blobFileTypes: ["stream", "excel", "download", "blob"],
  globalHeaders: () => ({
    "Content-Type": "application/json;charset=UTF-8",
    "Authorization": localStorage.getItem("token")
  }),
  handleNotification: (result) => import_antd.message.error(result.message || result.msg),
  handleLogout: void 0
};
var http = new import_fetch.default(defaultOptions);
var useFetch = (url, options = {}) => {
  const {
    data: body,
    autoAlertError = true,
    fetchOptions,
    ...useRequestOptions
  } = options;
  const fetcher = (requestData) => {
    if (requestData == null ? void 0 : requestData.nativeEvent)
      requestData = null;
    return http.post(url, requestData ?? body, fetchOptions, autoAlertError);
  };
  return (0, import_ahooks.useRequest)(fetcher, useRequestOptions);
};
useFetch.config = (options = {}) => {
  http = new import_fetch.default({
    baseUrl: options.baseUrl || defaultOptions.baseUrl,
    blobFileTypes: options.blobFileTypes || defaultOptions.blobFileTypes,
    silentErrorCodes: options.silentErrorCodes || defaultOptions.silentErrorCodes,
    logoutStatusCodes: options.logoutStatusCodes || defaultOptions.logoutStatusCodes,
    successfulStatusCode: options.successfulStatusCode || defaultOptions.successfulStatusCode,
    //function
    globalHeaders: options.globalHeaders || defaultOptions.globalHeaders,
    handleNotification: options.handleNotification || defaultOptions.handleNotification,
    handleLogout: options.handleLogout
  });
};
var useFetch_default = useFetch;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  downloadfile,
  http
});

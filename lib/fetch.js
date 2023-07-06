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

// src/fetch.ts
var fetch_exports = {};
__export(fetch_exports, {
  default: () => HttpRequest,
  downloadfile: () => downloadfile
});
module.exports = __toCommonJS(fetch_exports);
var HttpBase = class {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || "/api";
    this.successfulStatusCode = options.successfulStatusCode || [200];
    this.logoutStatusCodes = options.logoutStatusCodes || [401, 402, 403];
    this.silentErrorCodes = options.silentErrorCodes || [];
    this.blobFileTypes = options.blobFileTypes || ["stream", "excel", "download", "blob"];
    this.globalHeaders = options.globalHeaders || {
      "Content-Type": "application/json;charset=UTF-8"
    };
    this.handleNotification = options.handleNotification;
    this.handleLogout = options.handleLogout;
  }
};
var HttpRequest = class extends HttpBase {
  static createUrl(url, baseUrl) {
    if (typeof url !== "string")
      return baseUrl;
    if (!url.startsWith("/")) {
      url = `/${url}`;
    }
    return `${baseUrl}${url}`;
  }
  post(url, body, headers = {}, autoAlertError = true) {
    const isFormData = HttpRequest.isFormData(body);
    const globalHeaders = typeof this.globalHeaders === "function" ? this.globalHeaders() : this.globalHeaders;
    headers = Object.assign({}, globalHeaders, headers);
    if (isFormData)
      delete headers["Content-Type"];
    let currentResponse;
    return new Promise((resolve, reject) => {
      fetch(HttpRequest.createUrl(url, this.baseUrl), {
        method: "POST",
        headers,
        body: isFormData ? body : JSON.stringify(body)
      }).then((response) => {
        currentResponse = response;
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const contentType = (response.headers.get("content-type") || "").toLocaleLowerCase();
        if (this.blobFileTypes.some((it) => contentType.includes(it))) {
          return response.blob();
        }
        return response.json();
      }).then((result) => {
        var _a, _b;
        if (result instanceof Blob) {
          return resolve({
            code: this.successfulStatusCode,
            data: result,
            headers: currentResponse.headers
          });
        }
        const { code, data } = result;
        if (this.successfulStatusCode.includes(code)) {
          return resolve(data);
        }
        if (this.logoutStatusCodes.includes(code)) {
          (_a = this.handleLogout) == null ? void 0 : _a.call(this, result);
          return reject(result);
        }
        if (this.silentErrorCodes.includes(code)) {
          return reject(result);
        }
        if (autoAlertError) {
          (_b = this.handleNotification) == null ? void 0 : _b.call(this, result);
        }
        return reject(result);
      }).catch((error) => {
        var _a;
        (_a = this.handleNotification) == null ? void 0 : _a.call(this, error);
        return reject(error);
      });
    });
  }
  get(url, headers = {}, autoAlertError = true) {
    const path = HttpRequest.createUrl(url, this.baseUrl);
    return new Promise((resolve, reject) => {
      fetch(
        HttpRequest.createUrl(url, this.baseUrl),
        {
          method: "GET",
          headers
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then((result) => {
        const { code, data } = result;
      }).catch((error) => {
        return reject(error);
      });
    });
  }
  static isFormData(body) {
    return body instanceof FormData;
  }
};
var downloadfile = (response) => {
  var _a;
  const filename = (_a = decodeURIComponent((response.headers.get("content-disposition") || "").split("filename=")[1])) == null ? void 0 : _a.replaceAll('"', "");
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  downloadfile
});

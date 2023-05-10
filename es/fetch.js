import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var HttpBase = /*#__PURE__*/_createClass(function HttpBase() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, HttpBase);
  _defineProperty(this, "baseUrl", void 0);
  _defineProperty(this, "blobFileTypes", void 0);
  _defineProperty(this, "successfulStatusCode", void 0);
  _defineProperty(this, "logoutStatusCodes", void 0);
  _defineProperty(this, "silentErrorCodes", void 0);
  _defineProperty(this, "globalHeaders", void 0);
  _defineProperty(this, "handleNotification", void 0);
  _defineProperty(this, "handleLogout", void 0);
  this.baseUrl = options.baseUrl || '/api';
  this.successfulStatusCode = options.successfulStatusCode || [200];
  this.logoutStatusCodes = options.logoutStatusCodes || [401, 402, 403];
  this.silentErrorCodes = options.silentErrorCodes || [];
  this.blobFileTypes = options.blobFileTypes || ['stream', 'excel', 'download', 'blob'];
  this.globalHeaders = options.globalHeaders || {
    'Content-Type': 'application/json;charset=UTF-8'
  };
  this.handleNotification = options.handleNotification;
  this.handleLogout = options.handleLogout;
});
var HttpRequest = /*#__PURE__*/function (_HttpBase) {
  _inherits(HttpRequest, _HttpBase);
  var _super = _createSuper(HttpRequest);
  function HttpRequest() {
    _classCallCheck(this, HttpRequest);
    return _super.apply(this, arguments);
  }
  _createClass(HttpRequest, [{
    key: "post",
    value: function post(url, body) {
      var _this = this;
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var autoAlertError = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var isFormData = HttpRequest.isFormData(body);
      var globalHeaders = typeof this.globalHeaders === 'function' ? this.globalHeaders() : this.globalHeaders;
      headers = Object.assign({}, globalHeaders, headers);
      if (isFormData) delete headers['Content-Type'];
      var currentResponse;
      return new Promise(function (resolve, reject) {
        fetch(HttpRequest.createUrl(url, _this.baseUrl), {
          method: 'POST',
          headers: headers,
          body: isFormData ? body : JSON.stringify(body)
        }).then(function (response) {
          currentResponse = response;
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          var contentType = (response.headers.get('content-type') || '').toLocaleLowerCase();
          if (_this.blobFileTypes.some(function (it) {
            return contentType.includes(it);
          })) {
            return response.blob();
          }
          return response.json();
        }).then(function (result) {
          if (result instanceof Blob) {
            return resolve({
              code: _this.successfulStatusCode,
              data: result,
              headers: currentResponse.headers
            });
          }
          var code = result.code,
            data = result.data;
          //成功
          if (_this.successfulStatusCode.includes(code)) {
            return resolve(data);
          }
          //退出
          if (_this.logoutStatusCodes.includes(code)) {
            var _this$handleLogout;
            (_this$handleLogout = _this.handleLogout) === null || _this$handleLogout === void 0 ? void 0 : _this$handleLogout.call(_this, result);
            return reject(result);
          }
          //静默
          if (_this.silentErrorCodes.includes(code)) {
            return reject(result);
          }
          //全局错误通知
          if (autoAlertError) {
            var _this$handleNotificat;
            (_this$handleNotificat = _this.handleNotification) === null || _this$handleNotificat === void 0 ? void 0 : _this$handleNotificat.call(_this, result);
          }
          return reject(result);
        }).catch(function (error) {
          var _this$handleNotificat2;
          (_this$handleNotificat2 = _this.handleNotification) === null || _this$handleNotificat2 === void 0 ? void 0 : _this$handleNotificat2.call(_this, error);
          return reject(error);
        });
      });
    }
  }], [{
    key: "createUrl",
    value: function createUrl(url, baseUrl) {
      if (typeof url !== 'string') return baseUrl;
      if (!url.startsWith('/')) {
        url = "/".concat(url);
      }
      return "".concat(baseUrl).concat(url);
    }
  }, {
    key: "isFormData",
    value: function isFormData(body) {
      return body instanceof FormData;
    }
  }]);
  return HttpRequest;
}(HttpBase); //xhr response
export { HttpRequest as default };
export var downloadfile = function downloadfile(response) {
  var _decodeURIComponent;
  var filename = (_decodeURIComponent = decodeURIComponent((response.headers.get('content-disposition') || '').split('filename=')[1])) === null || _decodeURIComponent === void 0 ? void 0 : _decodeURIComponent.replaceAll('"', '');
  var url = window.URL.createObjectURL(response.data);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
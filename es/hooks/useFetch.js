import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["data", "autoAlertError", "fetchOptions"];
import { useRequest } from 'ahooks';
// import { message } from 'antd'
import { default as HttpRequest, downloadfile } from "../fetch";
var defaultOptions = {
  baseUrl: '/api',
  successfulStatusCode: [200],
  logoutStatusCodes: [401, 402],
  silentErrorCodes: [],
  blobFileTypes: ['stream', 'excel', 'download', 'blob'],
  globalHeaders: function globalHeaders() {
    return {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': localStorage.getItem('token')
    };
  },
  handleNotification: function handleNotification(result) {},
  // handleNotification: (result) => message.error(result.message || result.msg),
  handleLogout: undefined
};
var http = new HttpRequest(defaultOptions);
var useFetch = function useFetch(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var body = options.data,
    _options$autoAlertErr = options.autoAlertError,
    autoAlertError = _options$autoAlertErr === void 0 ? true : _options$autoAlertErr,
    fetchOptions = options.fetchOptions,
    useRequestOptions = _objectWithoutProperties(options, _excluded);
  var fetcher = function fetcher(requestData) {
    var _requestData, _requestData2;
    if ((_requestData = requestData) !== null && _requestData !== void 0 && _requestData.nativeEvent) requestData = null;
    return http.post(url, (_requestData2 = requestData) !== null && _requestData2 !== void 0 ? _requestData2 : body, fetchOptions, autoAlertError);
  };
  return useRequest(fetcher, useRequestOptions);
};

//配置fetch
useFetch.config = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  http = new HttpRequest({
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
export { downloadfile, http };
export default useFetch;
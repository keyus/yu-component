import _typeof from "@babel/runtime/helpers/esm/typeof";
export default {
  // 处理antd form values  为日期的字段，格式化成字符串
  valuesDate: function valuesDate(key, data) {
    var dateFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'YYYY-MM-DD';
    var isDateArray = function isDateArray(value) {
      return Array.isArray(value) && value.length > 0;
    };
    var format = function format(value) {
      return value === null || value === void 0 ? void 0 : value.format(dateFormat);
    };
    if (typeof key === 'string' && key in data) {
      var value = data[key];
      data[key] = isDateArray(value) ? [format(value[0]), format(value[1])] : format(value);
    }
    if (Array.isArray(key)) {
      key.forEach(function (item) {
        var value = data[item];
        data[item] = isDateArray(value) ? [format(value[0]), format(value[1])] : format(value);
      });
    }
    return data;
  },
  // 移除空值key或空字符串数组key
  removeEmpty: function removeEmpty(data) {
    if (_typeof(data) !== 'object') return data;
    Object.keys(data).forEach(function (key) {
      if (data[key] === '') return delete data[key];
      if (Array.isArray(data[key]) && data[key].toString() === '') {
        return delete data[key];
      }
    });
    return data;
  }
};
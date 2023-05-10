import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
//获取key对应的数据
export var getDataSource = function getDataSource(data, key) {
  if (Array.isArray(data)) return data;
  if (key.includes('.')) {
    var keys = key.split('.');
    var source = data;
    keys.forEach(function (it) {
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
//描述table api 最终的参数组合方式
export var getQuery = function getQuery(_ref) {
  var page = _ref.page,
    size = _ref.size,
    _ref$sorter = _ref.sorter,
    sorter = _ref$sorter === void 0 ? {} : _ref$sorter,
    _ref$search = _ref.search,
    search = _ref$search === void 0 ? {} : _ref$search,
    _ref$urlParams = _ref.urlParams,
    urlParams = _ref$urlParams === void 0 ? {} : _ref$urlParams;
  return _objectSpread(_objectSpread({
    page: page,
    size: size,
    orderField: sorter.orderField,
    isAsc: sorter.order === 'ascend'
  }, urlParams), search);
};
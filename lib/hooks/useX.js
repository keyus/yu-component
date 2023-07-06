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

// src/hooks/useX.ts
var useX_exports = {};
__export(useX_exports, {
  default: () => useX
});
module.exports = __toCommonJS(useX_exports);
var import_react = require("react");
function useX(column) {
  if (!Array.isArray(column))
    return 0;
  return (0, import_react.useMemo)(() => {
    if (!column.length)
      return 0;
    return column.reduce((a, b) => {
      return a + parseInt(b.width || 0);
    }, 0);
  }, [column]);
}

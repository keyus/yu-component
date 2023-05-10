import { useMemo } from 'react';
export default function useX(column) {
  if (!Array.isArray(column)) return 0;
  return useMemo(function () {
    if (!column.length) return 0;
    return column.reduce(function (a, b) {
      return a + parseInt(b.width || 0);
    }, 0);
  }, [column]);
}
;
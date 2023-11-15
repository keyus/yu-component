import type { Options, Result, Service } from 'ahooks/lib/useRequest/src/types'
import { useRequest } from 'ahooks'
import KyFetch, { downloadfile, } from '../fetch'
import type { Options as KyOption, } from '../fetch'

interface UseFetchOptions extends KyOption, Options<Record<string, unknown>, any[]> { }
const http = new KyFetch();
const isObject = (oj: unknown): boolean => Object.prototype.toString.call(oj) === '[object Object]';
const useFetch = (url: string, useFetchOptions: UseFetchOptions = {}): Result<Record<string, unknown>, any[]> => {
    const fetcher: Service<any, any> = (options: KyOption) => {
        if (isObject(options) && Object.hasOwn(options, 'nativeEvent')) options = null;
        return http.post(url, options || useFetchOptions);
    };
    return useRequest(fetcher, useFetchOptions);
};
useFetch.config = (options: KyOption = {}) => {
    http.extend(options);
}
export { downloadfile, http }
export default useFetch;

import type { Options, Result, Service } from 'ahooks/lib/useRequest/src/types'
import { useRequest } from 'ahooks'
import Rq, { downloadfile, isObject, } from '../fetch'
import type { RqInit, RequestOptions } from '../fetch'

type Obj = Record<string, unknown>;
export type Method = "get" | "post" | "put" | "delete" | "patch" | undefined | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseRequestOption extends Options<Obj, any[]> {
    closeError?: boolean;
    returnData?: boolean;
    json?: Obj;
    data?: Obj;
    method?: Method;
}

const rq = new Rq();
const useFetch = <TData = Obj>(url: string, options?: UseRequestOption): Result<TData, any[]> => {
    const { closeError, returnData, method, json, data, ...others } = options || {};

    const fetcher: Service<any, any> = (fetcherData?: Obj, fetcherOptions?: RequestOptions) => {
        if (isObject(fetcherData) && Object.prototype.hasOwnProperty.call(fetcherData, "nativeEvent")) {
            fetcherData = undefined;
        }
        const body = fetcherData ? fetcherData : json || data;

        fetcherOptions = Object.assign({}, { json: body, returnData, method, }, fetcherOptions || {},);
        return rq.request(url, fetcherOptions);
    };

    return useRequest(fetcher, others);

};
useFetch.config = (options: RqInit = {}) => {
    rq.config(options);
}
export { downloadfile, rq, Rq }
export default useFetch;

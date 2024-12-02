import type { Options, Result, Service } from 'ahooks/lib/useRequest/src/types'
import { useRequest } from 'ahooks'
import Rq, { downloadfile, isObject, } from '../fetch'
import type { RqInit, RequestOptions } from '../fetch'

type Obj = Record<string, unknown>;
interface UseRequestOption extends Options<Obj, any[]> {
    closeError?: boolean;
    returnData?: boolean;
    json?: Obj;
    data?: Obj;
}

const rq = new Rq();
const useFetch = <TData = Obj>(url: string, options?: UseRequestOption): Result<TData, any[]> => {
    const { closeError, returnData, json, data, ...others } = options || {};

    const fetcher: Service<any, any> = (fetcherData?: Obj, fetcherOptions?: RequestOptions) => {
        if (isObject(fetcherData) && Object.prototype.hasOwnProperty.call(fetcherData, "nativeEvent")) {
            fetcherData = undefined;
        }
        const body = fetcherData ? fetcherData : json || data;

        fetcherOptions = Object.assign({}, { json: body, returnData }, fetcherOptions || {},);
        return rq.request(url, fetcherOptions);
    };

    return useRequest(fetcher, others);

};
useFetch.config = (options: RqInit = {}) => {
    rq.config(options);
}
export { downloadfile, Rq }
export default useFetch;

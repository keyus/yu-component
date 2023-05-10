import type { Options, Result } from 'ahooks/lib/useRequest/src/types';
import { default as HttpRequest, downloadfile, HttpBaseOptions } from '../fetch';
export interface UseFetchOptions extends Options<Record<string, unknown>, any[]> {
    data?: Record<string, unknown>;
    autoAlertError?: boolean;
    fetchOptions?: RequestInit;
}
declare let http: HttpRequest;
declare const useFetch: {
    (url: string, options?: UseFetchOptions): Result<Record<string, unknown>, any[]>;
    config(options?: HttpBaseOptions): void;
};
export { downloadfile, http };
export default useFetch;
